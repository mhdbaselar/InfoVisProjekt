module Components.ParallelCoordinates
    exposing
        ( Axis
        , Series
        , ViewConfig
        , toSeriesFromModelData
        , view
        )

{-|
Dieses Modul rendert Parallele Koordinaten:

- baut Series aus App-Daten (Medals/Population/GDP/Age)
- unterstützt echtes Werte-Layout oder Rang-Layout (Ranking-Toggle)
- verwendet separate y-Skalen je Achse und eine gemeinsame x-Skala
- färbt Linien mit einem mehrstufigen Farbverlauf nach Medaillen-Rang
- zeigt bei Hover den Ländernamen rechts neben der letzten Achse an

Die API ist minimal: `toSeriesFromModelData` zur Datenaufbereitung und `view` zur Darstellung.
Hinweis: `toSeriesFromModelData` erwartet bereits vorgerankte Medaillendaten (Placement),
z. B. aus `model.medalTable`. Damit entfällt doppelte Rangberechnung im Modul.
-}

import Dict exposing (Dict)
import Color
import Color.Gradient as ColorGradient
import Color.Interpolate exposing (Space(..))
import List.Extra as ListExtra
import Json.Decode as Decode
import Path
import Scale exposing (ContinuousScale)
import Shape
import TypedSvg exposing (g, line, path, rect, svg, text_)
import TypedSvg.Attributes exposing (d, fill, fontSize, stroke, strokeOpacity, strokeWidth, textAnchor, transform, viewBox)
import TypedSvg.Attributes.InPx exposing (height, width, x, y, x1, y1, x2, y2)
import TypedSvg.Core exposing (Svg, text)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..), px)
import Html.Events as Events


-- PUBLIC TYPES


type alias Axis =
    { id : String
    , label : String
    }


type alias Series =
    { name : String
    , values : List ( String, Float ) -- (axisId, value)
    }


type alias ViewConfig =
    { width : Float
    , height : Float
    , padding : Float
    , ranking : Bool
    }


-- BUILD DATA FROM MODEL


{-| Erzeuge `Series` aus dem App-Model:
    - medals: total medals (gold+silver+bronze)
    - pop: Bevölkerung
    - gdp: BIP
    - age: Median-Alter

Es werden nur Länder genommen, die für alle Achsen Werte besitzen.
-}
toSeriesFromModelData :
    -- Vorgerankte Medaillendaten (placement = Wettbewerb-Rang 1,2,2,4, ...)
    List { country : String, placement : Int }
    -> Dict String { population : Int, medianAge : Int }
    -> Dict String Float
    -> List Axis
    -> List Series
toSeriesFromModelData rankedMedals popByCountry gdpByCountry axes =
    let
        -- Platzierungen (von extern bereitgestellt) in Dict umsetzen
        placementBy : Dict String Float
        placementBy =
            rankedMedals
                |> List.map (\r -> ( r.country, toFloat r.placement ))
                |> Dict.fromList

        popMap : Dict String Float
        popMap =
            popByCountry |> Dict.map (\_ v -> toFloat v.population)

        ageMap : Dict String Float
        ageMap =
            popByCountry |> Dict.map (\_ v -> toFloat v.medianAge)

        gdpMap : Dict String Float
        gdpMap = gdpByCountry

        -- Werte-Lookup je Achse/Land (für medals der Rang/Placement)
        getValue : String -> String -> Maybe Float
        getValue axisId country =
            case axisId of
                -- Für die Medaillen-Achse nehmen wir den Rangplatz (1 = bester)
                "medals" -> Dict.get country placementBy
                "pop" -> Dict.get country popMap
                "gdp" -> Dict.get country gdpMap
                "age" -> Dict.get country ageMap
                _ -> Nothing

        -- Nur Länder behalten, die für alle Achsen einen Wert besitzen
        countriesWithAll : List String
        countriesWithAll =
            let
                countries =
                    rankedMedals |> List.map .country
                        |> List.filter (\c ->
                            List.all (\a -> getValue a.id c /= Nothing) axes
                        )
            in
            ListExtra.unique countries

        mkSeries country =
            { name = country
            , values =
                axes
                    |> List.filterMap (\a -> getValue a.id country |> Maybe.map (\v -> ( a.id, v )))
            }
    in
    countriesWithAll |> List.map mkSeries


-- VIEW


view : ViewConfig -> List Axis -> List Series -> Maybe String -> (Maybe String -> msg) -> Svg msg
view cfg axes seriesList hoveredName onHover =
    let
        -- Anzahl Dimensionen und gemeinsame x-Skala (0..dimCount-1)
        dimCount = max 2 (List.length axes)

        xScale : ContinuousScale Float
        xScale =
            Scale.linear ( cfg.padding, cfg.width - cfg.padding ) ( 0, toFloat (dimCount - 1) )

        -- y-Skala je Dimension aus den Daten berechnen
        -- Alle Werte einer Achse aus den Series extrahieren (für Extents/Ticks)
        valuesForAxis : String -> List Float
        valuesForAxis aid =
            seriesList
                |> List.filterMap (\s ->
                    s.values |> List.filter (\( id, _ ) -> id == aid) |> List.head |> Maybe.map Tuple.second
                )

        -- Daten-Extent (lo,hi) mit kleiner Ausdehnung bei konstanten Werten
        extent : List Float -> ( Float, Float )
        extent vals =
            case ( List.minimum vals, List.maximum vals ) of
                ( Just lo, Just hi ) ->
                    if lo == hi then
                        ( lo - 1, hi + 1 )
                    else
                        ( lo, hi )

                _ ->
                    ( 0, 1 )

        -- Ranking-Unterstützung
        -- Für Nicht-Medaillenachsen: Wert -> Rang (1 = größter Wert oben)
        ranksForAxis : String -> Dict Float Float
        ranksForAxis aid =
            let
                sortedDesc =
                    valuesForAxis aid |> List.sort |> List.reverse

                uniques = ListExtra.unique sortedDesc
            in
            uniques
                |> List.indexedMap (\i v -> ( v, toFloat (i + 1) ))
                |> Dict.fromList

        -- Maximale Rangzahl je Achse (für Achsen-Domain)
        maxRank : String -> Float
        maxRank aid =
            toFloat (List.length (ListExtra.unique (valuesForAxis aid))) |> max 1

        -- Einheitliche maximale Rangzahl über alle Achsen, damit die Skalen gleich lang wirken
        globalMaxRank : Float
        globalMaxRank =
            axes
                |> List.map (.id >> maxRank)
                |> List.maximum
                |> Maybe.withDefault 1

        -- y-Skalen je Achse: bei Ranking gemeinsame Rang-Domain, sonst Daten-Extent
        yScales : List ( String, ContinuousScale Float )
        yScales =
            axes
                |> List.map (\a ->
                    if cfg.ranking then
                        -- Gleiche Rang-Domain fuer alle Achsen: [globalMaxRank .. 1]
                        ( a.id
                        , Scale.linear ( cfg.height - cfg.padding, cfg.padding ) ( globalMaxRank, 1 )
                        )
                    else
                        if a.id == "medals" then
                            -- Medaillenspiegel zeigt immer Platzierungen: 1 oben
                            ( a.id, Scale.linear ( cfg.height - cfg.padding, cfg.padding ) ( maxRank a.id, 1 ) )
                        else
                            let ( lo, hi ) = extent (valuesForAxis a.id) in
                            ( a.id, Scale.linear ( cfg.height - cfg.padding, cfg.padding ) ( lo, hi ) )
                )

        -- y-Skala zu einer Achsen-ID nachschlagen (Fallback [0..1])
        yScaleFor : String -> ContinuousScale Float
        yScaleFor aid =
            yScales
                |> List.filter (\( id, _ ) -> id == aid)
                |> List.head
                |> Maybe.map Tuple.second
                |> Maybe.withDefault (Scale.linear ( cfg.height - cfg.padding, cfg.padding ) ( 0, 1 ))

        axisPositions : List ( Int, Axis )
        axisPositions = axes |> List.indexedMap Tuple.pair

        -- Kurze Tick-Labels: Pop/GDP mit K/M/B/T, Age & Default als Ganzzahl
        formatTick axisId v =
            case axisId of
                "pop" ->
                    if v >= 1.0e9 then
                        String.fromFloat (toFloat (round (v / 1.0e8)) / 10) ++ "B"
                    else if v >= 1.0e6 then
                        String.fromFloat (toFloat (round (v / 1.0e5)) / 10) ++ "M"
                    else if v >= 1.0e3 then
                        String.fromFloat (toFloat (round (v / 1.0e2)) / 10) ++ "K"
                    else
                        String.fromInt (round v)

                "gdp" ->
                    if v >= 1.0e12 then
                        String.fromFloat (toFloat (round (v / 1.0e11)) / 10) ++ "T"
                    else if v >= 1.0e9 then
                        String.fromFloat (toFloat (round (v / 1.0e8)) / 10) ++ "B"
                    else if v >= 1.0e6 then
                        String.fromFloat (toFloat (round (v / 1.0e5)) / 10) ++ "M"
                    else
                        String.fromInt (round v)

                "age" ->
                    String.fromInt (round v)

                _ ->
                    String.fromInt (round v)

        -- Zeichnet eine einzelne Achse mit Ticks und Label
        axisSvg ( i, a ) =
            let
                xPos = Scale.convert xScale (toFloat i)
                yTop = cfg.padding
                yBot = cfg.height - cfg.padding
                -- Vorberechnungen: y-Scale, Rang-Achse, Ticks und Label-Formatter
                ys = yScaleFor a.id
                isRankAxis = cfg.ranking || a.id == "medals"
                ticks = Scale.ticks ys 5
                yAt t = Scale.convert ys t
                tickLabel t = if isRankAxis then String.fromInt (round t) else formatTick a.id t
            in
            g [ transform [ Translate xPos 0 ] ]
                [ rect [ x -1, y yTop, width 2, height (yBot - yTop), fill (Paint (Color.rgb255 200 200 200)) ] []
                , g []
                        (ticks
                            |> List.map (\t ->
                                let yy = yAt t in
                                g []
                                    [ line [ x1 -4, y1 yy, x2 4, y2 yy, stroke (Paint (Color.rgb255 180 180 180)), strokeWidth (px 1) ] []
                                    , text_ [ x 8, y (yy + 3), textAnchor AnchorStart, fontSize (px 10) ] [ text (tickLabel t) ]
                                    ]
                            )
                        )
                , text_ [ x 0, y (cfg.padding - 12), textAnchor AnchorMiddle, fontSize (px 12) ] [ text a.label ]
                ]

        -- Farbskala basierend auf Medaillen-Rang (invertiert: Rang 1 -> hoher t)
        medalsFor s =
            s.values
                |> List.filter (\( id, _ ) -> id == "medals")
                |> List.head
                |> Maybe.map Tuple.second
                |> Maybe.withDefault 0

        minMedals =
            seriesList |> List.map medalsFor |> List.minimum |> Maybe.withDefault 0

        maxMedals =
            seriesList |> List.map medalsFor |> List.maximum |> Maybe.withDefault 1

        span =
            let d = maxMedals - minMedals in
            if d == 0 then 1 else d

        normMedals v =
            if maxMedals == minMedals then
                0.5
            else
                (maxMedals - v) / span

        -- Mehrfarbige Farbpalette (Gradient) aufbauen
        -- Seed-Palette wird auf 256 Stufen interpoliert
        paletteSize = 256

        seedPalette : List Color.Color
        seedPalette =
            [ Color.rgb255 49 54 149   -- dunkelblau
            , Color.rgb255 69 117 180  -- blau
            , Color.rgb255 116 173 209 -- hellblau
            , Color.rgb255 171 217 233 -- cyan
            , Color.rgb255 224 243 248 -- sehr hell
            , Color.rgb255 254 224 144 -- gelb
            , Color.rgb255 253 174 97  -- orange
            , Color.rgb255 244 109 67  -- rot-orange
            , Color.rgb255 215 48 39   -- rot
            , Color.rgb255 165 0 38    -- dunkelrot
            ]

        gradientPalette : List Color.Color
        gradientPalette =
            ColorGradient.linearGradient RGB seedPalette paletteSize

        -- Mappt t in [0..1] auf eine Farbe aus der Gradienten-Palette
        gradientColor t =
            let
                idx =
                    let x = round (t * (toFloat paletteSize - 1)) in
                    clamp 0 (paletteSize - 1) x
            in
            ListExtra.getAt idx gradientPalette |> Maybe.withDefault (Color.rgb255 165 0 38)

        -- Zeichnet die Linie für ein Land, inkl. Ranking/Clamping und Hover-Effekten
        lineSvg s =
            let
                -- Werte pro Achse als Dict für schnellen Zugriff
                valsById : Dict String Float
                valsById = Dict.fromList s.values

                valueFor aid = Dict.get aid valsById

                -- Wert in plottbaren Wert umrechnen (Rang- oder Datenwert)
                toPlottable a v0 =
                    if cfg.ranking then
                        if a.id == "medals" then
                            clamp 1 globalMaxRank v0
                        else
                            Dict.get v0 (ranksForAxis a.id)
                                |> Maybe.map (\r -> clamp 1 globalMaxRank r)
                                |> Maybe.withDefault 1
                    else if a.id == "medals" then
                        -- bereits Rang, Domain in non-ranking: [maxRank..1]
                        clamp 1 (maxRank a.id) v0
                    else
                        v0

                xAt i = Scale.convert xScale (toFloat i)
                yAt aid v = Scale.convert (yScaleFor aid) v

                ptFor ( i, a ) =
                    valueFor a.id
                        |> Maybe.map (\v0 ->
                            let v = toPlottable a v0 in
                            ( xAt i, yAt a.id v )
                        )

                pts =
                    axisPositions
                        |> List.filterMap ptFor

                builder = Shape.line Shape.linearCurve (List.map Just pts)
                col = gradientColor (normMedals (medalsFor s))
                isHovered = Maybe.withDefault "" hoveredName == s.name
                faded = case hoveredName of
                    Nothing -> False
                    Just _ -> not isHovered
            in
            path
                ([ d (Path.toString builder)
                 , stroke (Paint col)
                 , strokeWidth (px (if isHovered then 3 else 1.2))
                 , strokeOpacity (TypedSvg.Types.Opacity (if faded then 0.15 else 1))
                 , fill PaintNone
                 , Events.on "mouseenter" (Decode.succeed (onHover (Just s.name)))
                 , Events.on "mouseleave" (Decode.succeed (onHover Nothing))
                 ]
                )
                []

        -- Extra SVG-Breite, damit das Hover-Label rechts nicht abgeschnitten wird
        rightLabelMargin = 60
        -- Tooltip/Label fuer Hover: Land + Ränge je sichtbarer Achse
        hoverLabel : List (Svg msg)
        hoverLabel =
            case hoveredName of
                Nothing -> []
                Just name ->
                    let
                        mSeries = seriesList |> List.filter (\s -> s.name == name) |> List.head
                    in
                    case mSeries of
                        Nothing -> []
                        Just s ->
                            let
                                lastIndex = dimCount - 1
                                lastAxis = axes |> List.drop lastIndex |> List.head |> Maybe.withDefault { id = "", label = "" }
                                v0 = s.values |> List.filter (\( id, _ ) -> id == lastAxis.id) |> List.head |> Maybe.map Tuple.second |> Maybe.withDefault 0
                                vPlot =
                                    if cfg.ranking then
                                        if lastAxis.id == "medals" then clamp 1 globalMaxRank v0 else (Dict.get v0 (ranksForAxis lastAxis.id) |> Maybe.withDefault 1)
                                    else if lastAxis.id == "medals" then
                                        clamp 1 (maxRank lastAxis.id) v0
                                    else
                                        v0
                                -- Linksbuendiges Hover-Label: Abstand zur letzten Achse
                                gapRight = 22
                                xLast = Scale.convert xScale (toFloat (dimCount - 1))
                                tx = xLast + gapRight
                                rawTy = Scale.convert (yScaleFor lastAxis.id) vPlot
                                ty = clamp (cfg.padding + 4) (cfg.height - cfg.padding - 4) rawTy
                            in
                            [ text_ [ x tx, y (ty - 6), textAnchor AnchorStart, fontSize (px 12) ] [ text name ] ]
    in
    svg [ viewBox 0 0 (cfg.width + rightLabelMargin) cfg.height, width (cfg.width + rightLabelMargin), height cfg.height ]
        [ g [] (List.map axisSvg axisPositions)
        , g [] (List.map lineSvg seriesList)
        , g [] hoverLabel
        ]

