module Model exposing (..)

import Dict
import Http
import Csv.Decode as Csv
import Tree exposing (Tree)
import Hierarchy
import List.Extra

-- Datenmodell
type alias Participation =
    { playerId : Int
    , name : String
    , sex : String
    , team : String
    , noc : String
    , year : Int
    , season : String
    , city : String
    , sport : String
    , event : String
    , medal : String
    }

type alias CountryMedals =
    { country : String
    , gold : Int
    , silver : Int
    , bronze : Int
    }

-- Tree Data for SunBurst-Vis
type alias SBTreeData =
    { sequence : List String, category : String, medalCount : Int }

-- Calculated svg-data for SunBurst-Vis
type alias LayedOutDatum =
    { x : Float, y : Float, width : Float, height : Float, value : Float, node : SBTreeData }

-- Advanced SunBurst-Vis model
type alias SBModel =
    { layout : List LayedOutDatum
    , hovered : Maybe { sequence : List String, percentage : Float }
    , total : Float
    }

type alias Model =
    { participations : List Participation
    , countryMedals : List CountryMedals
    , sbmodel : SBModel
    , sbcountry: String
    , loading : Bool
    , error : Maybe String
    }

type Msg
    = DataReceived (Result Http.Error String)
    | HoverSB (Maybe { sequence : List String, percentage : Float })
    | ChangeSBCountry String

init : ( Model, Cmd Msg )
init =
    ( { participations = []
      , countryMedals = []
      , sbmodel = { layout = [], total = 0, hovered = Nothing }
      , sbcountry = ""
      , loading = True
      , error = Nothing
      }
    , requestCsv csvUrl
    )

-- CSV laden
csvUrl : String
csvUrl = "/data/olympics_dataset.csv"

requestCsv : String -> Cmd Msg
requestCsv url =
    Http.get
        { url = url
        , expect = Http.expectString DataReceived
        }

decodeCsv : String -> Result String (List Participation)
decodeCsv body =
    case Csv.decodeCsv Csv.FieldNamesFromFirstRow participationDecoder body of
        Ok rows ->
            Ok rows

        Err _ ->
            Err "CSV decode error"


-- Decoder für alle Spalten aus der CSV (per Header-Namen)
participationDecoder : Csv.Decoder Participation
participationDecoder =
    Csv.into (\playerId name sex team noc year season city sport event medal ->
        { playerId = playerId
        , name = name
        , sex = sex
        , team = team
        , noc = noc
        , year = year
        , season = season
        , city = city
        , sport = sport
        , event = event
        , medal = medal
        }
    )
        |> Csv.pipeline (Csv.field "player_id" Csv.int)
        |> Csv.pipeline (Csv.field "Name" Csv.string)
        |> Csv.pipeline (Csv.field "Sex" Csv.string)
        |> Csv.pipeline (Csv.field "Team" Csv.string)
        |> Csv.pipeline (Csv.field "NOC" Csv.string)
        |> Csv.pipeline (Csv.field "Year" Csv.int)
        |> Csv.pipeline (Csv.field "Season" Csv.string)
        |> Csv.pipeline (Csv.field "City" Csv.string)
        |> Csv.pipeline (Csv.field "Sport" Csv.string)
        |> Csv.pipeline (Csv.field "Event" Csv.string)
        |> Csv.pipeline (Csv.field "Medal" Csv.string)


-- Filter: Nur Datensätze eines bestimmten Jahres behalten
filterByYear : Int -> List Participation -> List Participation
filterByYear year participations =
    List.filter (\p -> p.year == year) participations


-- Aggregation: List Participation -> List CountryMedals
toCountryMedals : List Participation -> List CountryMedals
toCountryMedals participations =
    let
        -- Hilfsfunktion: Land bestimmen
        getLand : Participation -> String
        getLand p =
            if p.team /= "" then p.team else p.noc

        -- Hilfsfunktion: Medaillen zählen
        addMedal : String -> CountryMedals -> CountryMedals
        addMedal medal countryMedals =
            case medal of
                "Gold" -> { countryMedals | gold = countryMedals.gold + 1 }
                "Silver" -> { countryMedals | silver = countryMedals.silver + 1 }
                "Bronze" -> { countryMedals | bronze = countryMedals.bronze + 1 }
                _ -> countryMedals

        -- Schrittweise Aufbau eines Dicts mit Land als Schlüssel
        updateDict : Participation -> Dict.Dict String CountryMedals -> Dict.Dict String CountryMedals
        updateDict p dict =
            if p.medal == "Gold" || p.medal == "Silver" || p.medal == "Bronze" then
                let
                    land = getLand p
                    old = Dict.get land dict |> Maybe.withDefault { country = land, gold = 0, silver = 0, bronze = 0 }
                    new = addMedal p.medal old
                in
                Dict.insert land new dict
            else
                dict
        medalsDict : Dict.Dict String CountryMedals
        medalsDict =
            List.foldl updateDict Dict.empty participations
    in
    Dict.values medalsDict

-- Filter: Nur Datensätze eines bestimmten Sports, Events und Medaillenart behalten
filterSportsEventMedal : List Participation -> List Participation
filterSportsEventMedal participations =
    let
        updateDict : Participation -> Dict.Dict String Participation -> Dict.Dict String Participation
        updateDict p dict =
            let
                sKey = String.concat[p.event, p.sport, p.team, p.medal] |> String.words |> String.concat
            in
            case Dict.get sKey dict of
                Just _ -> dict
                Nothing ->
                    Dict.insert sKey p dict

        sportsEventsDict : Dict.Dict String Participation
        sportsEventsDict =
            List.foldl updateDict Dict.empty participations
    in
    Dict.values sportsEventsDict

toSBModel : List Participation -> String -> SBModel
toSBModel parts country =
    let
        radius = 175
        
        -- Convert Participation to List of records
        recordData =
            parts
            |> List.filter (\c -> c.team == country && c.medal /= "No medal" )
            |> List.map (\p -> { sequence = List.append [ p.sport ] [ p.event ], medalCount = 1 })
            -- TODO: uniqueBy is a temporary solution!!!
            --       If one country won 2 medals in the same event medalCount must be 2 (or 3)
            |> List.Extra.uniqueBy (\r -> r.sequence)

        treeData =
            recordData
            |> Tree.stratifyWithPath
                { path = \item -> List.Extra.inits item.sequence
                , createMissingNode = \path -> { sequence = List.Extra.last path |> Maybe.withDefault [], medalCount = 0 }
                }
            |> Result.withDefault (Tree.singleton { sequence = ["Tree error"], medalCount = 0 })
            |> Tree.sumUp identity
                (\node children -> 
                    { node | medalCount = List.sum (List.map .medalCount children) }
                )
            |> Tree.map
                (\node ->
                    { sequence = node.sequence
                    , medalCount = node.medalCount
                    , category = List.Extra.last node.sequence |> Maybe.withDefault "end"
                    }
                )
            |> Tree.sortWith (\_ a b -> compare (Tree.label b).medalCount (Tree.label a).medalCount)
    in
    { layout = 
        treeData
            |> Hierarchy.partition [ Hierarchy.size (2 * pi) (radius * radius) ] (.medalCount >> toFloat)
            |> Tree.toList
            |> List.tail
            |> Maybe.withDefault []
            |> List.filter (\d -> d.width > 0.001)
    , total = toFloat (Tree.label treeData).medalCount
    , hovered = Nothing
    }