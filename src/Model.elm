module Model exposing (..)

import Dict
import Http
import Csv.Decode as Csv

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

type alias Model =
    { participations : List Participation
    , countryMedals : List CountryMedals
    , loading : Bool
    , error : Maybe String
    }

init : ( Model, Cmd Msg )
init =
    ( { participations = []
      , countryMedals = []
      , loading = True
      , error = Nothing
      }
    , requestCsv csvUrl
    )

type Msg
    = DataReceived (Result Http.Error String)

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

-- Mockdaten
mockData : List CountryMedals
mockData =
    [ { country = "USA", gold = 40, silver = 44, bronze = 42 }
    , { country = "China", gold = 40, silver = 27, bronze = 24 }
    , { country = "Japan", gold = 20, silver = 12, bronze = 13 }
    , { country = "Australien", gold = 18, silver = 19, bronze = 16 }
    , { country = "Frankreich", gold = 16, silver = 26, bronze = 22 }
    ]
