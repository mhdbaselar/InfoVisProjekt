module View exposing (..)

import Html exposing (Html, div, h1, h2, h3, text, a, img, p, table, thead, tbody, tr, th, td, select, option, input, span)
import Html.Attributes exposing (href, src, alt, style, id, selected, value, draggable, type_, checked)
import Html.Events as Events exposing (onInput, onCheck, on)
import Dict
import List.Extra as ListExtra
import Json.Decode as Decode
import Set
import Components.Sunburst exposing (sunburst)
import Components.ParallelCoordinates as PC
import Components.HeatMap exposing (heatmap)
import Model exposing (..)
import Helpers exposing (..)


-- Hilfsfunktionen: kompakte Zahlenformate für Debug-Tabelle

roundTo : Int -> Float -> Float
roundTo n v =
    let
        factor = 10 ^ n |> toFloat
    in
    (toFloat (round (v * factor))) / factor


trimFloat : String -> String
trimFloat s =
    if String.contains "." s then
        let
            noZeros =
                s
                    |> String.toList
                    |> List.reverse
                    |> ListExtra.dropWhile (\c -> c == '0')
                    |> (\cs ->
                        case cs of
                            '.' :: rest -> rest
                            _ -> cs
                       )
                    |> List.reverse
                    |> String.fromList
        in
        if noZeros == "-0" then "0" else noZeros
    else
        s


formatFixed : Int -> Float -> String
formatFixed n v =
    v |> roundTo n |> String.fromFloat |> trimFloat


formatWithSuffix : Float -> String
formatWithSuffix v =
    let
        absV = abs v
    in
    if absV >= 1.0e12 then
        formatFixed 1 (v / 1.0e12) ++ "T"
    else if absV >= 1.0e9 then
        formatFixed 1 (v / 1.0e9) ++ "B"
    else if absV >= 1.0e6 then
        formatFixed 1 (v / 1.0e6) ++ "M"
    else if absV >= 1.0e3 then
        formatFixed 0 (v / 1.0e3) ++ "K"
    else
        formatFixed 0 v


formatRelativeValue : String -> Float -> String
formatRelativeValue axisId v =
    case axisId of
        -- Für Bevölkerung: "pro 1M Einwohner"
        "pop" ->
            let
                per1M = v * 1.0e6
                a = abs per1M
                -- Schwelle: alles darunter als <0.001 anzeigen, um 0 zu vermeiden
                threshold = 0.001
            in
            if per1M == 0 then
                "0"
            else if a < threshold then
                "<0.001"
            else
                let
                    decs =
                        if a >= 100 then 0
                        else if a >= 10 then 1
                        else if a >= 1 then 2
                        else if a >= 0.1 then 3
                        else 4
                in
                formatFixed decs per1M

        -- Für BIP: "pro $1B"
        "gdp" ->
            let
                per1B = v * 1.0e9
                a = abs per1B
                threshold = 0.001
            in
            if per1B == 0 then
                "0"
            else if a < threshold then
                "<0.001"
            else
                let
                    decs =
                        if a >= 100 then 0
                        else if a >= 10 then 1
                        else if a >= 1 then 2
                        else if a >= 0.1 then 3
                        else 4
                in
                formatFixed decs per1B

        -- Für Alter: direkt (kleine Dezimalzahlen)
        "age" ->
            formatFixed 3 v

        _ ->
            formatFixed 3 v


formatPcValue : Bool -> String -> Float -> String
formatPcValue useRelative axisId v =
    if useRelative then
        formatRelativeValue axisId v
    else
        case axisId of
            "pop" -> formatWithSuffix v
            "gdp" -> formatWithSuffix v
            "age" -> formatFixed 0 v
            _ -> formatFixed 0 v

view : Model -> Html Msg
view model =
    div [ style "font-family" "Arial, sans-serif" ]
        [ -- Header mit Navigation
          headerSection
        , -- Visualisierungen untereinander
          div [ style "max-width" "1200px", style "margin" "0 auto", style "padding" "20px" ]
            [ medaillenspiegelSection model
            , medaillenverteilungSection model
            , parallelekoordinatensection model
            , heatmapSection model
            ]
        ]

-- Header mit Navigation und Olympischen Ringen
headerSection : Html Msg
headerSection =
    div [ style "text-align" "center", style "padding" "20px", style "background-color" "#f8f9fa", style "id" "top"]
        [ -- Navigation
          div [ style "margin-bottom" "20px" ]
            [ a [ href "#medaillenspiegel", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ]
                [ text "Medaillenspiegel" ]
            , text " | "
            , a [ href "#medaillenverteilung", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ]
                [ text "Medaillenverteilung" ]
            , text " | "
            , a [ href "#parallele-koordinaten", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ]
                [ text "Parallele Koordinaten" ]
            , text " | "
            , a [ href "#heatmap", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ]
                [ text "Medaillen Entwicklung" ]
            ]
        , -- Olympische Ringe
          div [ style "margin" "30px 0" ]
            [ img [ src "https://upload.wikimedia.org/wikipedia/commons/5/5c/Olympic_rings_without_rims.svg", alt "Olympische Ringe", style "width" "300px", style "height" "auto" ] [] ]
        , -- Hauptüberschrift
          h1 [ style "color" "#333", style "margin" "20px 0", style "font-size" "2.5em" ]
            [ text "Analyse des Medaillenspiegels der Olympischen Sommerspiele 2024" ]
        , -- Info-Kasten
          div [ style "max-width" "800px", style "margin" "0 auto", style "padding" "20px", style "border" "1px solid #ddd", style "border-radius" "5px", style "background-color" "#fff" ]
            [ p [] [ text "Diese interaktive Analyse führt Sie durch verschiedene Perspektiven auf die Medaillenverteilung der Olympischen Sommerspiele 2024. Scrollen Sie nach unten oder nutzen Sie die Navigation, um verschiedene Visualisierungen zu erkunden." ] ]
        ]

-- Sektion 1: Traditioneller Medaillenspiegel
medaillenspiegelSection : Model -> Html Msg
medaillenspiegelSection model =
    let
        selectedId = model.tableCriterion

        -- Dictionaries für absolute Werte
        popBy : Dict.Dict String Float
        popBy = model.populationByCountry |> Dict.map (\_ v -> toFloat v.population)

        ageBy : Dict.Dict String Float
        ageBy = model.populationByCountry |> Dict.map (\_ v -> toFloat v.medianAge)

        gdpBy : Dict.Dict String Float
        gdpBy = model.gdpByCountry

        medalTotalBy : Dict.Dict String Int
        medalTotalBy = model.medalTable |> List.map (\r -> ( r.country, r.total )) |> Dict.fromList

        -- Kriterium: absolute Werte je Land
        absByCountry : Dict.Dict String Float
        absByCountry =
            case selectedId of
                "pop" -> popBy
                "gdp" -> gdpBy
                "age" -> ageBy
                _ -> Dict.empty

        -- Kriterium: relative Werte je Land (Medaillen geteilt durch Wert, skaliert im Formatter)
        relByCountry : Dict.Dict String Float
        relByCountry =
            case selectedId of
                "pop" ->
                    Dict.foldl (\country pop acc ->
                        let m = medalTotalBy |> Dict.get country |> Maybe.withDefault 0 |> toFloat in
                        if pop <= 0 then acc else Dict.insert country (m / pop) acc
                    ) Dict.empty popBy

                "gdp" ->
                    Dict.foldl (\country gdp acc ->
                        let m = medalTotalBy |> Dict.get country |> Maybe.withDefault 0 |> toFloat in
                        if gdp <= 0 then acc else Dict.insert country (m / gdp) acc
                    ) Dict.empty gdpBy

                "age" ->
                    Dict.foldl (\country age acc ->
                        let m = medalTotalBy |> Dict.get country |> Maybe.withDefault 0 |> toFloat in
                        if age <= 0 then acc else Dict.insert country (m / age) acc
                    ) Dict.empty ageBy

                _ -> Dict.empty

        -- Rang je Land für aktuelles Kriterium (1-basiert)
        rankByCountry : Dict.Dict String Int
        rankByCountry =
            if selectedId == "medals" then
                model.medalTable |> List.map (\r -> ( r.country, r.placement )) |> Dict.fromList
            else
                let
                    namesSorted =
                        model.medalTable
                            |> List.sortWith (\a b ->
                                compare
                                    (Dict.get b.country relByCountry |> Maybe.withDefault 0)
                                    (Dict.get a.country relByCountry |> Maybe.withDefault 0)
                            )
                            |> List.map .country
                in
                namesSorted |> List.indexedMap (\i name -> ( name, i + 1 )) |> Dict.fromList

        sortedRows =
            if selectedId == "medals" then
                model.medalTable |> List.sortBy .placement
            else
                model.medalTable
                    |> List.sortWith (\a b ->
                        compare
                            (Dict.get b.country relByCountry |> Maybe.withDefault 0)
                            (Dict.get a.country relByCountry |> Maybe.withDefault 0)
                    )
        limitedRows =
            if (model.collapseMedalTable == True) then
                List.take 10 sortedRows
            else
                sortedRows

        relHeader : List (Html Msg)
        relHeader =
            case selectedId of
                "pop" ->
                    [ th [ style "text-align" "center", style "padding" "12px" ] [ text ("Einwohner (Wert)") ]
                    , th [ style "text-align" "center", style "padding" "12px" ] [ text "Med/Pop" ]
                    ]
                "gdp" ->
                    [ th [ style "text-align" "center", style "padding" "12px" ] [ text ("BIP (Wert)") ]
                    , th [ style "text-align" "center", style "padding" "12px" ] [ text "Med/GDP" ]
                    ]
                "age" ->
                    [ th [ style "text-align" "center", style "padding" "12px" ] [ text ("Median-Alter (Wert)") ]
                    , th [ style "text-align" "center", style "padding" "12px" ] [ text "Med/Age" ]
                    ]
                _ -> []
    in
    div [ id "medaillenspiegel", style "margin" "60px 0", style "padding" "20px" ]
        [ div [ style "max-width" "900px", style "margin" "0 auto" ]
            [ h2 [ style "text-align" "left", style "margin-bottom" "20px", style "color" "#333" ]
                [ text "1. Medaillenspiegel" ]
            -- Kriterium-Auswahl + Sprung zu Parallelen Koordinaten
            , div [ style "margin" "8px 0 16px 0", style "display" "flex", style "align-items" "center", style "justify-content" "space-between" ]
                [ -- links: Auswahl
                    div [ style "display" "flex", style "gap" "8px", style "align-items" "center" ]
                        [ span [] [ text "Kriterium für Ranking:" ]
                        , select [ onInput SetTableCriterion ]
                                (model.pcmodel.axes
                                        |> List.map (\ax ->
                                                if ax.id == selectedId then
                                                        option [ selected True, value ax.id ] [ text (axisLabel ax.id) ]
                                                else
                                                        option [ value ax.id ] [ text (axisLabel ax.id) ]
                                        )
                                )
                        ]
                    -- rechts: Button-Link
                , a
                    [ href "#parallele-koordinaten"
                    , style "display" "inline-block"
                    , style "padding" "8px 12px"
                    , style "background-color" "#007cba"
                    , style "color" "#fff"
                    , style "border-radius" "4px"
                    , style "text-decoration" "none"
                    ]
                    [ text "Vergleiche Rankings" ]
                ]
            , if model.loading then
                p [] [ text "Lade Daten..." ]
              else
                case model.error of
                    Just err ->
                        p [ style "color" "#b00020" ] [ text ("Fehler beim Laden: " ++ err) ]
                    Nothing ->
                        text ""
            , div [ style "max-width" "950px", style "margin" "8px auto 0", style "text-align" "center", style "color" "#555", style "font-size" "12px" ]
                [ p [] [ text "Tip: Click any table row to select the country and jump to its medal distribution below." ] ]    
            , table [ style "width" "100%", style "border-collapse" "collapse" ]
                [ thead []
                    [ tr [ style "background-color" "#007cba", style "color" "white" ]
                        ( [ th [ style "text-align" "left", style "padding" "12px" ] [ text "Platz" ]
                          , th [ style "text-align" "left", style "padding" "12px" ] [ text "Land" ]
                          , th [ style "text-align" "center", style "padding" "12px" ] [ text "Gold" ]
                          , th [ style "text-align" "center", style "padding" "12px" ] [ text "Silber" ]
                          , th [ style "text-align" "center", style "padding" "12px" ] [ text "Bronze" ]
                          , th [ style "text-align" "center", style "padding" "12px" ] [ text "Gesamt" ]
                          ] ++ relHeader)
                    ]
                , tbody []
                    (limitedRows
                        |> List.map
                            (\r ->
                                let
                                    isHovered = model.hoverTable == Just r.country
                                    rowBg = if isHovered then "#e6f5ff" else "transparent"
                                    rowCursor = "pointer"
                                    rankVal = Dict.get r.country rankByCountry |> Maybe.withDefault r.placement
                                    absVal = Dict.get r.country absByCountry
                                    relVal = Dict.get r.country relByCountry
                                in
                                tr
                                    [ style "border-bottom" "1px solid #ddd"
                                    , style "background-color" rowBg
                                    , style "cursor" rowCursor
                                    , Events.onMouseEnter (HoverMedalTable (Just r.country))
                                    , Events.onMouseLeave (HoverMedalTable Nothing)
                                    , Events.onClick (SelectCountryFromTable r.country)
                                    ]
                                    ([ td [ style "padding" "0" ] [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none" ] [ text (String.fromInt rankVal) ] ]
                                    , td [ style "padding" "0" ] [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "font-weight" "bold" ] [ text (nocToCountry r.country) ] ]
                                    , td [ style "padding" "0" ] [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center" ] [ text (String.fromInt r.gold) ] ]
                                    , td [ style "padding" "0" ] [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center" ] [ text (String.fromInt r.silver) ] ]
                                    , td [ style "padding" "0" ] [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center" ] [ text (String.fromInt r.bronze) ] ]
                                    , td [ style "padding" "0" ]
                                        [ a
                                            ( [ href "#medaillenverteilung"
                                                , style "display" "block"
                                                , style "padding" "10px"
                                                , style "color" "inherit"
                                                , style "text-decoration" "none"
                                                , style "text-align" "center"
                                                ]
                                                ++ (if selectedId == "medals" then [ style "font-weight" "bold" ] else [])
                                            )
                                            [ text (String.fromInt r.total) ]
                                        ]
                                    ]
                                    ++ (case selectedId of
                                            "pop" ->
                                                [ td [ style "padding" "0" ]
                                                    [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center" ]
                                                        [ text (absVal |> Maybe.map (formatPcValue False "pop") |> Maybe.withDefault "-") ]
                                                    ]
                                                , td [ style "padding" "0" ]
                                                    [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center", style "font-weight" "bold" ]
                                                        [ text (relVal |> Maybe.map (formatRelativeValue "pop") |> Maybe.withDefault "-") ]
                                                    ]
                                                ]
                                            "gdp" ->
                                                [ td [ style "padding" "0" ]
                                                    [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center" ]
                                                        [ text (absVal |> Maybe.map (formatPcValue False "gdp") |> Maybe.withDefault "-") ]
                                                    ]
                                                , td [ style "padding" "0" ]
                                                    [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center", style "font-weight" "bold" ]
                                                        [ text (relVal |> Maybe.map (formatRelativeValue "gdp") |> Maybe.withDefault "-") ]
                                                    ]
                                                ]
                                            "age" ->
                                                [ td [ style "padding" "0" ]
                                                    [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center" ]
                                                        [ text (absVal |> Maybe.map (formatPcValue False "age") |> Maybe.withDefault "-") ]
                                                    ]
                                                , td [ style "padding" "0" ]
                                                    [ a [ href "#medaillenverteilung", style "display" "block", style "padding" "10px", style "color" "inherit", style "text-decoration" "none", style "text-align" "center", style "font-weight" "bold" ]
                                                        [ text (relVal |> Maybe.map (formatRelativeValue "age") |> Maybe.withDefault "-") ]
                                                    ]
                                                ]
                                            _ -> []
                                       )
                                    )
                            )
                    )
                ]
                , div [ style "text-align" "center", style "max-width" "900px", style "margin" "10px auto 0" ]
                    [ div
                        [ style "display" "inline-block"
                        , style "padding" "10px 16px"
                        , style "background-color" "#007cba"
                        , style "color" "#fff"
                        , style "border-radius" "4px"
                        , style "text-decoration" "none"
                        , style "cursor" "pointer"
                        , Events.onClick CollapseMedalTable
                        ]
                        [ text (if (model.collapseMedalTable == True) then "Alle anzeigen" else "Weniger anzeigen") ]
                ]
            ]
        , div [ style "text-align" "right", style "max-width" "900px", style "margin" "10px auto 0" ]
            [ linkToTop ]
        ]

-- Sektion 2: Medaillenverteilung
medaillenverteilungSection : Model -> Html Msg
medaillenverteilungSection model =
    let
        -- Hilfsfunktion: Alle Ländernamen laden
        -- Liste von (noc, name) Paaren, Value = NOC, Anzeige = Ländername
        countries : List ( String, String )
        countries =
            model.participations
                |> List.map (.noc)
                |> Set.fromList
                |> Set.toList
                |> List.map (\noc -> ( noc, nocToCountry noc ))

    in
    div [ id "medaillenverteilung", style "margin" "60px 0", style "padding" "20px"]
        [ div [ style "max-width" "900px", style "margin" "0 auto" ]
            [ h2 [ style "text-align" "left", style "margin-bottom" "20px", style "color" "#333" ]
                [ text "2. Medaillenverteilung" ]
            , if model.loading then
                p [] [ text "Lade Daten..." ]
              else
                case model.error of
                    Just err ->
                        p [ style "color" "#b00020" ] [ text ("Fehler beim Laden: " ++ err) ]
                    Nothing ->
                        text ""
            , div [] [
                div [style "display" "flex", style "flex-direction" "row", style "justify-content" "space-between"] [
                    div [ style "display" "flex", style "gap" "8px", style "align-items" "center" ] [
                        text "Dargestelltes Land:"
                        , select [style "width" "180px", onInput ChangeSBCountry ]
                        ( countries
                            |> List.map (\( noc, name ) ->
                                if noc == model.sbcountry then
                                    option [ selected True, value noc ] [ text name ]
                                else
                                    option [ value noc ] [ text name ]
                            )
                        )
                    ]
                    , text (String.concat ["Anzahl Medaillen: ", String.fromFloat model.sbmodel.total])
                ]
                , div [style "width" "100%", style "height" "100%"] [
                    if model.sbmodel.total > 0 then
                        div [ style "max-width" "950px", style "margin" "8px auto 0", style "text-align" "center", style "color" "#555", style "font-size" "12px" ]
                            [ text "Tip: More details will be displayed when you hover over the category" ]
                    else div [] []
                    , sunburst model.sbmodel model.sbcountry
                ]
            ]
        ]
        , div [ style "text-align" "right", style "max-width" "900px", style "margin" "10px auto 0" ]
            [ linkToTop ]
        ]

-- Sektion 3: Parallele Koordinaten
parallelekoordinatensection : Model -> Html Msg
parallelekoordinatensection model =
    div [ id "parallele-koordinaten", style "margin" "60px 0", style "padding" "20px" ]
        [ h2 [ style "margin" "0 0 16px 0" ] [ text "3. Parallele Koordinaten" ]
        , let
            axes = model.pcmodel.axes

            series = model.pcmodel.series

            cfg =
                { width = 950, height = 520, padding = 50, ranking = model.pcmodel.ranking }
          in
          div []
            [ div [ style "display" "flex", style "justify-content" "center", style "gap" "8px", style "margin-bottom" "8px" ]
                (List.concat
                    [ [ span
                            ([ style "padding" "4px 8px"
                            , style "border" (if model.dropTargetAxis == Just "__start__" then "2px dashed #007cba" else "1px solid #ccc")
                            , style "border-radius" "4px"
                            , style "color" "#777"
                            , Events.preventDefaultOn "dragover" (Decode.map (\_ -> ( DragOverAxis "__start__", True )) Decode.value)
                            , Events.preventDefaultOn "drop" (Decode.map (\_ -> ( DropAxis "__start__", True )) Decode.value)
                            ] ++ (if model.dropTargetAxis == Just "__start__" then [ style "background-color" "#eaf5ff" ] else []))
                            [ text "Drop am Anfang" ]
                      ]
                    , List.map (\a ->
                        span
                            ([ style "padding" "4px 8px"
                            , style "border" (if model.dropTargetAxis == Just a.id then "2px solid #007cba" else "1px solid #ccc")
                            , style "border-radius" "4px"
                            , style "cursor" "grab"
                            , draggable "true"
                            , on "dragstart" (Decode.succeed (StartDragAxis a.id))
                            , Events.preventDefaultOn "dragover" (Decode.map (\_ -> ( DragOverAxis a.id, True )) Decode.value)
                            , Events.preventDefaultOn "drop" (Decode.map (\_ -> ( DropAxis a.id, True )) Decode.value)
                            ] ++ (if model.dropTargetAxis == Just a.id then [ style "background-color" "#eaf5ff" ] else []))
                            [ Html.a
                                [ href "#medaillenspiegel"
                                , Events.onClick (SetTableCriterion a.id)
                                , style "color" "#007cba"
                                , style "text-decoration" (if model.tableCriterion == a.id then "underline" else "none")
                                ]
                                [ text a.label ]
                            ]
                        ) axes
                    , [ span
                            ([ style "padding" "4px 8px"
                            , style "border" (if model.dropTargetAxis == Just "__end__" then "2px dashed #007cba" else "1px dashed #ccc")
                            , style "border-radius" "4px"
                            , style "color" "#777"
                            , Events.preventDefaultOn "dragover" (Decode.map (\_ -> ( DragOverAxis "__end__", True )) Decode.value)
                            , Events.preventDefaultOn "drop" (Decode.map (\_ -> ( DropAxis "__end__", True )) Decode.value)
                            ] ++ (if model.dropTargetAxis == Just "__end__" then [ style "background-color" "#eaf5ff" ] else []))
                            [ text "Drop ans Ende" ]
                      ]
                    ])
        , div [ style "max-width" "950px", style "margin" "8px auto 0", style "text-align" "center", style "color" "#555", style "font-size" "12px" ]
            [ p [] [ text "Tip: You can reorder the axes by dragging the axis labels above the chart (drag and drop)." ]
            , p [] [ text "Tip: Click any axis label above to jump to the medal table and set that criterion." ]
            ]

            , div [ style "display" "flex", style "justify-content" "center", style "margin-bottom" "12px", style "gap" "8px", style "align-items" "center" ]
                [ span [] [ text "Ranking" ]
                , input [ type_ "checkbox", checked model.ranking, onCheck ToggleRanking ] []
                , span [ style "margin-left" "16px" ] [ text "Relative (Medaillen / Pop, GDP, Age)" ]
                , input [ type_ "checkbox", checked model.useRelative, onCheck TogglePcMode ] []
                , span [ style "margin-left" "16px" ] [ text "Tabelle" ]
                , input [ type_ "checkbox", checked model.showPcDebug, onCheck TogglePcDebug ] []
                ]
            , div [ style "display" "flex", style "justify-content" "center" ]
                [ PC.view cfg axes series model.pcHover SetPcHover ]
            , div [ style "max-width" "750px", style "margin" "8px auto 0", style "text-align" "center", style "color" "#555", style "font-size" "12px" ]
                [ p [] [ text "Note: EOR (Refugee Olympic Team) and AIN (Individual Neutral Athletes) are not countries. Therefore, there are no values for population, GDP or age, which is why they are not included in this ranking." ] ]
            -- Hilfstabelle
            , if model.showPcDebug then
                let
                    -- 1) Platzierungen und Medaillen-Summen je Land vorbereiten
                    placementBy : Dict.Dict String Int
                    placementBy =
                        series
                            |> List.filterMap (\s ->
                                s.values
                                    |> List.filter (\( id, _ ) -> id == "medals")
                                    |> List.head
                                    |> Maybe.map (\(_, v) -> ( s.name, round v ))
                            )
                            |> Dict.fromList

                    medalSumBy : Dict.Dict String Int
                    medalSumBy =
                        model.medalTable
                            |> List.map (\r -> ( r.country, r.total ))
                            |> Dict.fromList

                    -- 2) Werte je Achse vorab in Dicts legen: axisId -> (country -> value)
                    axisValuesBy : Dict.Dict String (Dict.Dict String Float)
                    axisValuesBy =
                        axes
                            |> List.map (\a ->
                                ( a.id
                                , series
                                    |> List.filterMap (\s ->
                                        s.values
                                            |> List.filter (\( id, _ ) -> id == a.id)
                                            |> List.head
                                            |> Maybe.map (\(_, v) -> ( s.name, v ))
                                    )
                                    |> Dict.fromList
                                )
                            )
                            |> Dict.fromList

                    nonMedalAxes = axes |> List.filter (\a -> a.id /= "medals")

                    -- 3) Rang-Maps pro Nicht-Medaillenachse: axisId -> (value -> rank)
                    rankDictByAxis : Dict.Dict String (Dict.Dict Float Int)
                    rankDictByAxis =
                        nonMedalAxes
                            |> List.map (\a ->
                                let
                                    vals =
                                        axisValuesBy
                                            |> Dict.get a.id
                                            |> Maybe.withDefault Dict.empty
                                            |> Dict.values
                                            |> List.sort
                                            |> List.reverse
                                    uniques = ListExtra.unique vals
                                    dict = uniques |> List.indexedMap (\i v -> ( v, i + 1 )) |> Dict.fromList
                                in
                                ( a.id, dict )
                            )
                            |> Dict.fromList

                    -- 4) Länder nach Platz sortieren
                    rows =
                        series
                            |> List.map .name
                            |> List.sortWith (\a b ->
                                compare (Dict.get a placementBy |> Maybe.withDefault 9999)
                                        (Dict.get b placementBy |> Maybe.withDefault 9999)
                            )

                    -- Headerzellen
                    headerCells =
                        let
                            valueHeaders =
                                axes
                                    |> List.concatMap (\a ->
                                        if a.id == "medals" then
                                            [ th [ style "text-align" "center", style "padding" "6px" ] [ text "Medaillenspiegel" ]
                                            , th [ style "text-align" "center", style "padding" "6px" ] [ text "Medaillen" ]
                                            ]
                                        else
                                            let
                                                labelSuffix =
                                                    if model.useRelative then
                                                        case a.id of
                                                            "pop" -> " (pro 1M)"
                                                            "gdp" -> " (pro $1B)"
                                                            "age" -> " (rel.)"
                                                            _ -> " (rel.)"
                                                    else
                                                        " (Wert)"
                                            in
                                            [ th [ style "text-align" "center", style "padding" "6px" ] [ text (a.label ++ labelSuffix) ] ]
                                    )

                            rankHeaders =
                                nonMedalAxes
                                    |> List.map (\a -> th [ style "text-align" "center", style "padding" "6px" ] [ text (a.label ++ " (Rang)") ])
                        in
                        th [ style "text-align" "left", style "padding" "6px" ] [ text "Land" ]
                            :: (valueHeaders ++ rankHeaders)
                in
                div [ style "max-width" "1000px", style "margin" "16px auto", style "font-size" "12px" ]
                    [ table [ style "width" "100%", style "border-collapse" "collapse" ]
                        ([ thead [] [ tr [] headerCells ]
                         , tbody []
                            (rows
                                |> List.map (\name ->
                                    let
                                        valueTds =
                                            axes
                                                |> List.concatMap (\a ->
                                                    case a.id of
                                                        "medals" ->
                                                            [ td [ style "padding" "4px", style "text-align" "center" ] [ text (Dict.get name placementBy |> Maybe.withDefault 0 |> String.fromInt) ]
                                                            , td [ style "padding" "4px", style "text-align" "center" ] [ text (Dict.get name medalSumBy |> Maybe.withDefault 0 |> String.fromInt) ]
                                                            ]
                                                        _ ->
                                                            let
                                                                vVal =
                                                                    axisValuesBy
                                                                        |> Dict.get a.id
                                                                        |> Maybe.withDefault Dict.empty
                                                                        |> Dict.get name
                                                                        |> Maybe.withDefault 0
                                                            in
                                                            [ td [ style "padding" "4px", style "text-align" "center" ] [ text (formatPcValue model.useRelative a.id vVal) ] ]
                                                            -- [ td [ style "padding" "4px", style "text-align" "center" ] [ text (String.fromFloat vVal) ] ]
                                                )

                                        rankTds =
                                            nonMedalAxes
                                                |> List.map (\a ->
                                                    let
                                                        v =
                                                            axisValuesBy
                                                                |> Dict.get a.id
                                                                |> Maybe.withDefault Dict.empty
                                                                |> Dict.get name
                                                                |> Maybe.withDefault 0
                                                        r =
                                                            rankDictByAxis
                                                                |> Dict.get a.id
                                                                |> Maybe.withDefault Dict.empty
                                                                |> Dict.get v
                                                                |> Maybe.withDefault 0
                                                    in
                                                    td [ style "padding" "4px", style "text-align" "center" ] [ text (String.fromInt r) ]
                                                )
                                    in
                                    tr [ style "border-bottom" "1px solid #eee" ]
                                        ( td [ style "padding" "4px", style "text-align" "left" ] [ text name ]
                                            :: (valueTds ++ rankTds)
                                        )
                                )
                            )
                         ]
                        )
                    ]
              else
                text ""
            ]

    , div [ style "text-align" "right" ] [ linkToTop ]
        ]

-- Sektion 4: HeatMap
heatmapSection : Model -> Html Msg
heatmapSection model =
    div [ id "heatmap", style "margin" "60px 0", style "padding" "20px" ]
        [ div [ style "max-width" "900px", style "margin" "0 auto" ]
            [ h2 [ style "text-align" "left", style "margin-bottom" "20px", style "color" "#333" ]
                [ text "4. Medaillen Entwicklung" ]
            , if model.loading then
                p [] [ text "Lade Daten..." ]
              else
                case model.error of
                    Just err ->
                        p [ style "color" "#b00020" ] [ text ("Fehler beim Laden: " ++ err) ]
                    Nothing ->
                        text ""
            , div [ style "display" "flex", style "flex-direction" "column", style "align-items" "center", style "gap" "12px" ]
                [ div [ style "font-size" "12px", style "color" "#555" ]
                    [ text "Tip: Hover cells to see values." ]
                , heatmap model.heatmapmodel
                ]
            ]
        , div [ style "text-align" "right", style "max-width" "900px", style "margin" "10px auto 0" ]
            [ linkToTop ]
        ]


-- "Weiter" CTA as styled link
linkToTop : Html msg
linkToTop =
    a
        [ href "#top"
        , style "display" "inline-block"
        , style "padding" "10px 16px"
        , style "background-color" "#007cba"
        , style "color" "#fff"
        , style "border-radius" "4px"
        , style "text-decoration" "none"
        ]
        [ text "Nach Oben" ]


