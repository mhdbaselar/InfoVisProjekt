module Model exposing (..)

import Char
import Csv.Decode as Csv
import Dict exposing (Dict)
import Hierarchy
import Http
import List.Extra
import Tree
import String exposing (fromInt)


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

-- Medaillentabelle (Platzierungen + Gesamt)

type alias MedalTableRow =
    { country : String
    , gold : Int
    , silver : Int
    , bronze : Int
    , total : Int
    , placement : Int
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
        [ requestOlympiaCsv olympiaCsvUrl
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
olympiaCsvUrl : String
olympiaCsvUrl = "/data/olympics_dataset.csv"

populationCsvUrl : String
populationCsvUrl = "/data/world_population_data.csv"

gdpCsvUrl : String
gdpCsvUrl = "/data/world_data_2023.csv"


requestOlympiaCsv : String -> Cmd Msg
requestOlympiaCsv url =
    Http.get
        { url = url
    , expect = Http.expectString OlympiaReceived
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
        , team = normalizeCountry team
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


-- Filter: Nur einzigartige Sport-Event-Medaille-Kombinationen behalten

filterSportsEventMedal : List Participation -> List Participation
filterSportsEventMedal participations =
    let
        updateDict : Participation -> Dict String Participation -> Dict String Participation
        updateDict p dict =
            let
                sKey = String.concat [ p.event, p.sport, p.team, p.medal ] |> String.words |> String.concat
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
        getLand p = if p.team /= "" then p.team else p.noc

        addMedal medal ( g, s, b ) =
            case medal of
                "Gold" -> ( g + 1, s, b )
                "Silver" -> ( g, s + 1, b )
                "Bronze" -> ( g, s, b + 1 )
                _ -> ( g, s, b )

        medalsByCountry : Dict String ( Int, Int, Int )
        medalsByCountry =
            List.foldl
                (\p dict ->
                    if p.medal == "Gold" || p.medal == "Silver" || p.medal == "Bronze" then
                        let
                            land = normalizeCountry (getLand p)
                            old = Dict.get land dict |> Maybe.withDefault ( 0, 0, 0 )
                        in
                        Dict.insert land (addMedal p.medal old) dict
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
                row = { country = c.country, gold = c.gold, silver = c.silver, bronze = c.bronze, total = c.gold + c.silver + c.bronze, placement = rank }
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
            model.medalTable |> List.map (\r -> ( r.country, (toFloat r.placement, r.total) )) |> Dict.fromList

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
        countries = model.medalTable |> List.map .country |> List.filter (\c -> c /= "EOR" && c /= "AIN")

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

toHMModel : List Participation -> HMModel
toHMModel parts = 
    let
        years =
            parts
            |> List.filter (\p -> p.year >= 2000)
            |> List.map .year
            |> List.Extra.unique
            |> List.sort
        
        _ = Debug.log "" years
        _ = Debug.log "" teams

        teams =
            parts
            |> List.filter (\p -> p.year >= 2000 && (String.length p.team) == 6)
            |> List.map .team
            |> List.Extra.unique
            |> List.sort

        dataMatrix =
            List.map
            (\team ->
                List.map
                (\year ->
                    parts
                    |> filterSportsEventMedal
                    |> List.filter (\p -> p.team == team && p.year == year)
                    |> List.map (\p -> if(p.medal /= "No medal") then 1 else 0)
                    |> List.sum
                    --|> fromInt
                )
                years
            )
            teams
    in
    { data = dataMatrix, columnLabels = (List.map fromInt years), rowLabels = teams, selected = Nothing }
