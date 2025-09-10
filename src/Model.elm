module Model exposing (..)

import Char
import Csv.Decode as Csv
import Dict exposing (Dict)
import Hierarchy
import Http
import List.Extra
import Tree
import String exposing (fromInt)
import Helpers exposing (..)


-- Datenmodell
type alias Participation =
    { medal : String
    , name : String
    , sport : String
    , event : String
    , noc : String
    , year : Int
    }

-- Medaillentabelle (Platzierungen + Gesamt)

type alias MedalTableRow =
    { country : String
    , gold : Int
    , silver : Int
    , bronze : Int
    , total : Int
    , placement : Int
    , year : Int
    }


-- Parallele Koordinaten Data

type alias PCAxis = { id : String, label : String }

type alias PCSeries = { name : String, values : List ( String, Float ) }

type alias PCModel =
    { axes : List PCAxis
    , series : List PCSeries
    , hovered : Maybe String
    , ranking : Bool
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

type alias Cell =
    { value : Float
    , message : String
    , row : Int
    , column : Int
    }

type alias HMModel =
    { data : List (List Float)
    , columnLabels : List String
    , rowLabels : List String
    , selected : Maybe Cell
    }


-- App Model

type alias Model =
    { participations : List Participation
    , medalTable : List MedalTableRow
    , populationByCountry : Dict String { population : Int, medianAge : Int }
    , gdpByCountry : Dict String Float
    , sbmodel : SBModel
    , sbcountry : String
    , hoverTable : Maybe String
    , tableCriterion : String
    , axisOrder : List String
    , draggingAxis : Maybe String
    , dropTargetAxis : Maybe String
    , ranking : Bool
    , useRelative : Bool
    , showPcDebug : Bool
    , pcHover : Maybe String
    , pcmodel : PCModel
    , heatmapmodel : HMModel
    , loading : Bool
    , error : Maybe String
    }

type Msg
    = OlympiaReceived (Result Http.Error String)
    | PopulationReceived (Result Http.Error String)
    | GdpReceived (Result Http.Error String)
    | OlympiaHistroyReceived (Result Http.Error String)
    | HoverSB (Maybe { sequence : List String, percentage : Float })
    | ChangeSBCountry String
    | HoverMedalTable (Maybe String)
    | SelectCountryFromTable String
    | NoOp
    | SetTableCriterion String
    | StartDragAxis String
    | DragOverAxis String
    | DropAxis String
    | ToggleRanking Bool
    | TogglePcMode Bool
    | TogglePcDebug Bool
    | SetPcHover (Maybe String)
    | OnHoverHeatMap Cell
    | OnLeaveHeatMap

init : ( Model, Cmd Msg )
init =
    ( { participations = []
      , medalTable = []
      , populationByCountry = Dict.empty
      , gdpByCountry = Dict.empty
      , sbmodel = { layout = [], total = 0, hovered = Nothing }
      , sbcountry = ""
      , hoverTable = Nothing
      , tableCriterion = "medals"
      , axisOrder = [ "medals", "pop", "gdp", "age" ]
      , draggingAxis = Nothing
      , dropTargetAxis = Nothing
      , ranking = True
    , useRelative = False
      , showPcDebug = False
      , pcHover = Nothing
      , pcmodel = { axes = [], series = [], hovered = Nothing, ranking = False }
      , heatmapmodel = { data = [], columnLabels = [], rowLabels = [], selected = Nothing}
      , loading = True
      , error = Nothing
      }
    , Cmd.batch
        [ requestOly2024Csv olympia2024CsvUrl
        , requestPopulationCsv populationCsvUrl
        , requestGdpCsv gdpCsvUrl
    ]
    )

-- Einheitliche Ländernamen (für Joins zwischen Datensätzen)
normalizeCountry : String -> String
normalizeCountry name =
    case name of
        "Ivory Coast" -> "Côte d'Ivoire"
        "Cote d'Ivoire" -> "Côte d'Ivoire"
        "DPR Korea" -> "North Korea"
        "Korea" -> "South Korea"
        "IR Iran" -> "Iran"
        "Czech Republic" -> "Czechia"
        "Czech Republic (Czechia)" -> "Czechia"
        "Republic of Ireland" -> "Ireland"
        "Chinese Taipei" -> "Taiwan"
        "Hong Kong, China" -> "Hong Kong"
        "Türkiye" -> "Turkey"
        "Republic of Moldova" -> "Moldova"
        "Great Britain" -> "United Kingdom"
        _ -> name


-- HeatMap-Team-Normalisierung: entfernt numerisches Suffix wie "-1"/"-2" am Ende
stripTrailingDashDigits : String -> String
stripTrailingDashDigits s =
    let
        parts = String.split "-" s
    in
    case List.reverse parts of
        lastPart :: restRev ->
            if String.all Char.isDigit lastPart && (List.length parts >= 2) then
                restRev |> List.reverse |> String.join "-"
            else
                s

        _ ->
            s


normalizeTeamHM : String -> String
normalizeTeamHM team =
    stripTrailingDashDigits team

-- Manuelle BIP-Overrides (Keys müssen bereits normalisierte Ländernamen sein)
manualGdpOverrides : Dict String Float
manualGdpOverrides =
    Dict.fromList
        [
            ("Taiwan", 757340000000), -- https://de.statista.com/statistik/daten/studie/320284/umfrage/bruttoinlandsprodukt-bip-von-taiwan/
            ("Hong Kong", 381070000000), -- https://de.statista.com/statistik/daten/studie/322338/umfrage/bruttoinlandsprodukt-bip-von-hongkong/
            ("Kosovo", 10470000000), -- https://de.statista.com/statistik/daten/studie/415738/umfrage/bruttoinlandsprodukt-bip-des-kosovo/
            ("Cabo Verde", 2588000000), -- https://www.statista.com/statistics/727077/gross-domestic-product-gdp-in-cabo-verde/
            ("Puerto Rico", 117900000000) -- https://www.statista.com/statistics/398235/gross-domestic-product-gdp-in-puerto-rico/
        ]


-- Manuelle Population/Median-Age-Overrides (Keys: normalisierte Ländernamen)
manualPopulationOverrides : Dict String { population : Int, medianAge : Int }
manualPopulationOverrides =
    Dict.fromList
        [
            -- Median-Alter https://database.earth/population/kosovo-under-unsc-res-1244/median-age
            -- population https://countrymeters.info/en/Kosovo#google_vignette
            ("Kosovo", { population = 1772128, medianAge = 32 })
        ]

-- CSV laden
olympia2024CsvUrl : String
olympia2024CsvUrl = "/data/medals2024.csv"

olympiaHistoryCsvUrl : String
olympiaHistoryCsvUrl = "/data/medalsHistory.csv"

populationCsvUrl : String
populationCsvUrl = "/data/world_population_data.csv"

gdpCsvUrl : String
gdpCsvUrl = "/data/world_data_2023.csv"

requestOly2024Csv : String -> Cmd Msg
requestOly2024Csv url =
    Http.get
        { url = url
        , expect = Http.expectString OlympiaReceived
        }

requestOlyHistoryCsv : String -> Cmd Msg
requestOlyHistoryCsv url =
    Http.get
        { url = url
        , expect = Http.expectString OlympiaHistroyReceived
        }

requestPopulationCsv : String -> Cmd Msg
requestPopulationCsv url =
    Http.get
        { url = url
        , expect = Http.expectString PopulationReceived
        }

requestGdpCsv : String -> Cmd Msg
requestGdpCsv url =
    Http.get
        { url = url
        , expect = Http.expectString GdpReceived
        }


-- Decoder für olympics_dataset.csv

decodeOlympiaCsv : String -> Result String (List Participation)
decodeOlympiaCsv body =
    case Csv.decodeCsv Csv.FieldNamesFromFirstRow decoder2024 body of
        Ok rows ->
            Ok rows

        Err _ ->
            Err "CSV decode error"


-- Decoder für alle Spalten aus der CSV (per Header-Namen)
decoder2024 : Csv.Decoder Participation
decoder2024 =
    Csv.into (\medal_type name discipline event country_code ->
        { medal = medal_type
        , name = name
        , sport = discipline
        , event = event
        , noc = country_code
        , year = 2024
        }
    )
        |> Csv.pipeline (Csv.field "medal_type" Csv.string)
        |> Csv.pipeline (Csv.field "name" Csv.string)
        |> Csv.pipeline (Csv.field "discipline" Csv.string)
        |> Csv.pipeline (Csv.field "event" Csv.string)
        |> Csv.pipeline (Csv.field "country_code" Csv.string)

decodeOlyHistroyCsv : String -> Result String (List MedalTableRow)
decodeOlyHistroyCsv body =
    case Csv.decodeCsv Csv.FieldNamesFromFirstRow decoderHistory body of
        Ok rows ->
            Ok
                (rows
                    |> List.filter (\row -> String.contains "summer" (String.toLower row.edition))
                    |> List.map (\row -> { country = row.country, gold = row.gold, silver = row.silver, bronze = row.bronze, total = row.total, placement = row.placement, year = row.year })
                )

        Err _ ->
            Err "CSV decode error"

-- Decoder für alle Spalten aus der CSV (per Header-Namen)

type alias RawOlyHistData =
    { country : String
    , gold : Int
    , silver : Int
    , bronze : Int
    , total : Int
    , placement : Int
    , year : Int
    , edition : String
    }

decoderHistory : Csv.Decoder RawOlyHistData
decoderHistory =
    -- edition,year,country,country_noc,gold,silver,bronze,total
    Csv.into (\edition year country gold silver bronze total ->
        { country = country
        , gold = gold
        , silver = silver
        , bronze = bronze
        , total = total
        , placement = 0
        , year = year
        , edition = edition
        }
    )
        |> Csv.pipeline (Csv.field "edition" Csv.string)
        |> Csv.pipeline (Csv.field "year" Csv.int)
        |> Csv.pipeline (Csv.field "country" Csv.string)
        |> Csv.pipeline (Csv.field "gold" Csv.int)
        |> Csv.pipeline (Csv.field "silver" Csv.int)
        |> Csv.pipeline (Csv.field "bronze" Csv.int)
        |> Csv.pipeline (Csv.field "total" Csv.int)
        
-- Filter: Nur Datensätze eines bestimmten Jahres behalten
filterByYear : Int -> List Participation -> List Participation
filterByYear year participations =
    List.filter (\p -> p.year == year) participations


-- Filter: Nur einzigartige Sport-Event-Medaille-Kombinationen behalten

filterSportsEventMedal : List Participation -> List Participation
filterSportsEventMedal participations =
    let
        updateDict : Participation -> Dict String Participation -> Dict String Participation
        updateDict p dict =
            let
                -- Verwende NOC statt Team für eindeutige Länder-Kombination
                sKey = String.concat [ p.event, p.sport, p.noc, p.medal ] |> String.words |> String.concat
            in
            case Dict.get sKey dict of
                Just _ ->
                    dict

                Nothing ->
                    Dict.insert sKey p dict

        sportsEventsDict : Dict String Participation
        sportsEventsDict =
            List.foldl updateDict Dict.empty participations
    in
    Dict.values sportsEventsDict


-- Medaillentabelle mit Platzierungen (Competition Ranking 1,2,2,4)

toMedalTable : List Participation -> List MedalTableRow
toMedalTable participations =
    let
        -- Land ausschließlich über NOC bestimmen (Team kann mehrfach pro Land vorkommen)
        getCountry p = p.noc |> nocToCountry |> normalizeCountry

        addMedal medal ( g, s, b ) =
            case medal of
                "Gold Medal" -> ( g + 1, s, b )
                "Silver Medal" -> ( g, s + 1, b )
                "Bronze Medal" -> ( g, s, b + 1 )
                _ -> ( g, s, b )

        medalsByCountry : Dict String ( Int, Int, Int )
        medalsByCountry =
            List.foldl
                (\p dict ->
                    if p.medal == "Gold Medal" || p.medal == "Silver Medal" || p.medal == "Bronze Medal" then
                        let
                            country = normalizeCountry (getCountry p)
                            old = Dict.get country dict |> Maybe.withDefault ( 0, 0, 0 )
                        in
                        Dict.insert country (addMedal p.medal old) dict
                    else
                        dict
                )
                Dict.empty
                participations

        rowsUnranked : List { country : String, gold : Int, silver : Int, bronze : Int }
        rowsUnranked =
            medalsByCountry
                |> Dict.toList
                |> List.map (\( country, ( g, s, b ) ) -> { country = country, gold = g, silver = s, bronze = b })

        sorted =
            rowsUnranked
                |> List.sortWith
                    (\a b ->
                        case compare b.gold a.gold of
                            EQ ->
                                case compare b.silver a.silver of
                                    EQ -> compare b.bronze a.bronze
                                    ord -> ord
                            ord -> ord
                    )

        step ( idx, c ) ( maybePrev, prevRank, acc ) =
            let
                triple = ( c.gold, c.silver, c.bronze )
                rank =
                    case maybePrev of
                        Nothing -> 1
                        Just prevTriple -> if prevTriple == triple then prevRank else idx + 1
                row = { country = c.country, gold = c.gold, silver = c.silver, bronze = c.bronze, total = c.gold + c.silver + c.bronze, placement = rank, year = 2024 }
            in
            ( Just triple, rank, row :: acc )
    in
    sorted
        |> List.indexedMap Tuple.pair
        |> List.foldl step ( Nothing, 0, [] )
        |> (\(_,_,rows) -> List.reverse rows)


-- Population/Median-Age CSV Parsing

type alias PopulationRow =
    { country : String
    , population : Int
    , medianAge : Int
    }


decodePopulationCsv : String -> Result String (List PopulationRow)
decodePopulationCsv body =
    let
        parseIntOrZero : String -> Int
        parseIntOrZero s =
            s
                |> String.filter (\c -> Char.isDigit c)
                |> String.toInt
                |> Maybe.withDefault 0

        decoder : Csv.Decoder PopulationRow
        decoder =
            Csv.into (\country popStr ageStr ->
                { country = normalizeCountry country
                , population = parseIntOrZero popStr
                , medianAge = parseIntOrZero ageStr
                }
            )
                |> Csv.pipeline (Csv.field "Country" Csv.string)
                |> Csv.pipeline (Csv.field "Population (2024)" Csv.string)
                |> Csv.pipeline (Csv.field "Med. Age" Csv.string)
    in
    case Csv.decodeCsv Csv.FieldNamesFromFirstRow decoder body of
        Ok rows ->
            Ok rows

        Err _ ->
            Err "CSV decode error (population)"


-- GDP CSV Parsing

type alias GdpRow =
    { country : String
    , gdp : Float
    }


decodeGdpCsv : String -> Result String (List GdpRow)
decodeGdpCsv body =
    let
        parseMoneyOrZero : String -> Float
        parseMoneyOrZero s =
            s
                |> String.filter (\c -> Char.isDigit c || c == '.')
                |> String.toFloat
                |> Maybe.withDefault 0

        decoder : Csv.Decoder GdpRow
        decoder =
            Csv.into (\country gdpStr ->
                { country = normalizeCountry country
                , gdp = parseMoneyOrZero gdpStr
                }
            )
                |> Csv.pipeline (Csv.field "Country" Csv.string)
                |> Csv.pipeline (Csv.field "GDP" Csv.string)
    in
    case Csv.decodeCsv Csv.FieldNamesFromFirstRow decoder body of
        Ok rows ->
            Ok rows

        Err _ ->
            Err "CSV decode error (gdp)"


-- Sunburst vorbereiten wie zuvor

sportsToCategory : String -> String -> List String
sportsToCategory sport event =
    -- TODO: make complete
    case sport of
        "Swimming" -> ["Aquatics", "Swimming", event]
        "Equestrian" -> "Equestrian" :: (String.split " " event)
        "Canoe Slalom" -> ["Canoe", "Slalom", event]
        "Canoe Sprint" -> ["Canoe", "Sprint", event]
        _ -> [sport, event]

toSBModel : List Participation -> String -> SBModel
toSBModel parts country =
    let
        radius = 175

        -- Convert Participation to List of records
        recordData =
            parts
            |> List.filter (\c -> c.noc == country && c.medal /= "No medal" )
            |> List.map (\p -> { sequence = sportsToCategory p.sport p.event, medalCount = 1 })
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


-- PC Model

axisLabel : String -> String
axisLabel aid =
    case aid of
        "medals" -> "Medaillenspiegel"
        "pop" -> "Einwohner"
        "gdp" -> "BIP"
        "age" -> "Median-Alter"
        _ -> aid


toPCModel : Model -> PCModel
toPCModel model =
    let
        axes = model.axisOrder |> List.map (\aid -> { id = aid, label = axisLabel aid })

        placementBy : Dict String (Float, Int)
        placementBy =
            model.medalTable |> List.map (\r -> ( r.country |> nocToCountry |> normalizeCountry, (toFloat r.placement, r.total) )) |> Dict.fromList

        popBy : Dict String Float
        popBy = model.populationByCountry |> Dict.map (\_ v -> toFloat v.population)

        ageBy : Dict String Float
        ageBy = model.populationByCountry |> Dict.map (\_ v -> toFloat v.medianAge)

        gdpBy : Dict String Float
        gdpBy = model.gdpByCountry

        safeDiv : Float -> Float -> Float
        safeDiv num den = if den <= 0 then 0 else num / den

        getValue : String -> String -> Float
        getValue axisId country =
            if model.useRelative then
                let
                    total_medals = Dict.get country placementBy |> Maybe.withDefault (9999,0) |> Tuple.second |> toFloat
                in
                case axisId of
                    "medals" -> Dict.get country placementBy |> Maybe.withDefault (9999,0) |> Tuple.first
                    "pop" -> safeDiv total_medals (Dict.get country popBy |> Maybe.withDefault 0)
                    "gdp" -> safeDiv total_medals (Dict.get country gdpBy |> Maybe.withDefault 0)
                    "age" -> safeDiv total_medals (Dict.get country ageBy |> Maybe.withDefault 0)
                    _ -> 0
            else
                case axisId of
                    "medals" -> Dict.get country placementBy |> Maybe.withDefault (9999,0) |> Tuple.first
                    "pop" -> Dict.get country popBy |> Maybe.withDefault 0
                    "gdp" -> Dict.get country gdpBy |> Maybe.withDefault 0
                    "age" -> Dict.get country ageBy |> Maybe.withDefault 0
                    _ -> 0

        countries : List String
        countries =
            model.medalTable
                |> List.map (.country >> nocToCountry >> normalizeCountry)
                |> List.filter (\c -> c /= "Refugee Olympic Team" && c /= "Individual Neutral Athletes")

        seriesFor : String -> PCSeries
        seriesFor country =
            { name = country
            , values = axes |> List.map (\a -> ( a.id, getValue a.id country ))
            }

        series : List PCSeries
        series = countries |> List.map seriesFor
    in
    { axes = axes
    , series = series
    , hovered = model.pcHover
    , ranking = model.ranking
    }


recomputePcModel : Model -> Model
recomputePcModel m =
    { m | pcmodel = toPCModel m }

toHMModel : List MedalTableRow -> List String -> HMModel
toHMModel rows teams =
    let
        -- Jahre ermitteln
        allYears = rows |> List.map .year |> List.sort |> List.Extra.unique
        addRow p dict = 
            let 
                country = p.country |> nocToCountry |> normalizeCountry
            in
            if (country /= "Refugee Olympic Team") && (country /= "Individual Neutral Athletes") then
                Dict.update ( country, p.year ) (\_ -> Just p.total) dict
            else
                dict

        countsBy : Dict ( String, Int ) Int
        countsBy = List.foldl addRow Dict.empty rows

        dataMatrix : List (List Float)
        dataMatrix = 
            teams
                |> List.map (\team ->
                    allYears
                        |> List.map (\y -> countsBy |> Dict.get ( team, y ) |> Maybe.withDefault 0 |> toFloat)
                   )
    in
    { data = dataMatrix
    , columnLabels = (List.map fromInt allYears)
    , rowLabels = teams
    , selected = Nothing
    }
