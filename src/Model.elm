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

type alias LandMedaillen =
    { land : String
    , gold : Int
    , silber : Int
    , bronze : Int
    }

type alias Model =
    { medaillen : List LandMedaillen
    , loading : Bool
    , error : Maybe String
    }

init : ( Model, Cmd Msg )
init =
    ( { medaillen = []
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


-- Aggregation: Participation -> List LandMedaillen
toMedaillen : List Participation -> List LandMedaillen
toMedaillen participations =
    let
        -- Hilfsfunktion: Land bestimmen
        getLand : Participation -> String
        getLand p =
            if p.team /= "" then p.team else p.noc

        -- Hilfsfunktion: Medaillen zählen
        addMedal : String -> LandMedaillen -> LandMedaillen
        addMedal medal landMedaillen =
            case medal of
                "Gold" -> { landMedaillen | gold = landMedaillen.gold + 1 }
                "Silver" -> { landMedaillen | silber = landMedaillen.silber + 1 }
                "Bronze" -> { landMedaillen | bronze = landMedaillen.bronze + 1 }
                _ -> landMedaillen

        -- Schrittweise Aufbau eines Dicts mit Land als Schlüssel
        updateDict : Participation -> Dict.Dict String LandMedaillen -> Dict.Dict String LandMedaillen
        updateDict p dict =
            if p.medal == "Gold" || p.medal == "Silver" || p.medal == "Bronze" then
                let
                    land = getLand p
                    old = Dict.get land dict |> Maybe.withDefault { land = land, gold = 0, silber = 0, bronze = 0 }
                    new = addMedal p.medal old
                in
                Dict.insert land new dict
            else
                dict
        medaillenDict : Dict.Dict String LandMedaillen
        medaillenDict =
            List.foldl updateDict Dict.empty participations
    in
    Dict.values medaillenDict


-- Mockdaten
mockData : List LandMedaillen
mockData =
    [ { land = "USA", gold = 40, silber = 44, bronze = 42 }
    , { land = "China", gold = 40, silber = 27, bronze = 24 }
    , { land = "Japan", gold = 20, silber = 12, bronze = 13 }
    , { land = "Australien", gold = 18, silber = 19, bronze = 16 }
    , { land = "Frankreich", gold = 16, silber = 26, bronze = 22 }
    ]
