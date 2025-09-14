module View exposing (..)

import Html exposing (Html, div, h1, h2, text, a, img, p, table, thead, tbody, tr, th, td, select, option, span, strong)
import Html.Attributes exposing (href, src, alt, style, id, selected, value, draggable)
import Html.Events as Events exposing (onInput, on)
import Dict
import List.Extra as ListExtra
import Json.Decode as Decode
import Set
import Components.Sunburst exposing (sunburst)
import Components.ParallelCoordinates as PC
import Components.HeatMap exposing (heatmap)
import Model exposing (..)
import Helpers exposing (..)


-- Helper functions: compact number formats for debug table

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
        -- For population: "per 1M inhabitants"
        "pop" ->
            let
                per1M = v * 1.0e6
                a = abs per1M
                -- Threshold: anything below is displayed as <0.001 to avoid 0
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

        -- For GDP: "per $1B"
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

        -- For age: directly (small decimal numbers)
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

-- Unified helpers for tips / notes with bold label prefix (inline)
singleTip : String -> Html Msg
singleTip tip =
    p [ style "margin" "0 0 4px 0" ] [ strong [] [ text "Tip: " ], text tip ]

multipleTips : List String -> Html Msg
multipleTips tips =
    case tips of
        [] -> text ""
        _ ->
            div []
                (p [ style "margin" "0 0 4px 0", style "font-weight" "bold", style "text-align" "center" ] [ text "Tips:" ]
                    :: List.map (\t -> p [ style "margin" "0 0 4px 0" ] [ text t ]) tips
                )

singleNote : String -> Html Msg
singleNote note =
    p [ style "margin" "0 0 4px 0" ] [ strong [] [ text "Note: " ], text note ]

multipleNotes : List String -> Html Msg
multipleNotes notes =
    case notes of
        [] -> text ""
        _ ->
            div []
                (p [ style "margin" "0 0 4px 0", style "font-weight" "bold", style "text-align" "center" ] [ text "Notes:" ]
                    :: List.map (\n -> p [ style "margin" "0 0 4px 0" ] [ text n ]) notes
                )

view : Model -> Html Msg
view model =
    div [ style "font-family" "Arial, sans-serif" ]
        [ -- Header with navigation
          headerSection
        , -- Visualizations stacked
          div [ style "max-width" "1200px", style "margin" "0 auto", style "padding" "20px" ]
            [ medaillenspiegelSection model
            , medaillenverteilungSection model
            , parallelekoordinatensection model
            , heatmapSection model
            ]
        ]

-- Header with navigation and Olympic rings
headerSection : Html Msg
headerSection =
    div [ style "text-align" "center", style "padding" "20px", style "background-color" "#f8f9fa", style "id" "top"]
        [ div [ style "margin-bottom" "20px" ]
            [ a [ href "#medaillenspiegel", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ] [ text "Medal Table" ]
            , text " | "
            , a [ href "#medaillenverteilung", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ] [ text "Medal Distribution" ]
            , text " | "
            , a [ href "#parallele-koordinaten", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ] [ text "Parallel Coordinates" ]
            , text " | "
            , a [ href "#heatmap", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ] [ text "Medal Evolution" ]
            ]
        , div [ style "margin" "30px 0" ]
            [ img [ src "https://upload.wikimedia.org/wikipedia/commons/5/5c/Olympic_rings_without_rims.svg", alt "Olympic Rings", style "width" "300px", style "height" "auto" ] [] ]
        , h1 [ style "color" "#333", style "margin" "20px 0", style "font-size" "2.5em" ]
            [ text "Analysis of the 2024 Summer Olympics Medal Table" ]
        , div [ style "max-width" "800px", style "margin" "0 auto", style "padding" "20px", style "border" "1px solid #ddd", style "border-radius" "5px", style "background-color" "#fff" ]
            [ p [] [ text "This interactive analysis guides you through multiple perspectives on the medal distribution of the Paris 2024 Olympic Games. Scroll down or use the navigation to explore the visualizations." ] ]
        ]

-- Section 1: Traditional medal table
medaillenspiegelSection : Model -> Html Msg
medaillenspiegelSection model =
    let
        selectedId = model.tableCriterion

        -- Dictionaries for absolute values
        popBy : Dict.Dict String Float
        popBy = model.populationByCountry |> Dict.map (\_ v -> toFloat v.population)

        ageBy : Dict.Dict String Float
        ageBy = model.populationByCountry |> Dict.map (\_ v -> toFloat v.medianAge)

        gdpBy : Dict.Dict String Float
        gdpBy = model.gdpByCountry

        medalTotalBy : Dict.Dict String Int
        medalTotalBy = model.medalTable |> List.map (\r -> ( r.country, r.total )) |> Dict.fromList

        -- Criterion: absolute values per country
        absByCountry : Dict.Dict String Float
        absByCountry =
            case selectedId of
                "pop" -> popBy
                "gdp" -> gdpBy
                "age" -> ageBy
                _ -> Dict.empty

        -- Criterion: relative values per country (medals divided by value, scaled in formatter)
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

        -- Rank per country for current criterion (1-based)
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
                    [ th [ style "text-align" "center", style "padding" "12px" ] [ text ("Population (value)") ]
                    , th [ style "text-align" "center", style "padding" "12px" ] [ text "Med/Pop" ]
                    ]
                "gdp" ->
                    [ th [ style "text-align" "center", style "padding" "12px" ] [ text ("GDP (value)") ]
                    , th [ style "text-align" "center", style "padding" "12px" ] [ text "Med/GDP" ]
                    ]
                "age" ->
                    [ th [ style "text-align" "center", style "padding" "12px" ] [ text ("Median age (value)") ]
                    , th [ style "text-align" "center", style "padding" "12px" ] [ text "Med/Age" ]
                    ]
                _ -> []
    in
    div [ id "medaillenspiegel", style "margin" "60px 0", style "padding" "20px" ]
        [ div [ style "max-width" "900px", style "margin" "0 auto" ]
            [ h2 [ style "text-align" "left", style "margin-bottom" "20px", style "color" "#333" ]
                [ text "1. Medal Table" ]
            -- Criterion selection + jump to parallel coordinates
            , div [ style "margin" "8px 0 16px 0", style "display" "flex", style "align-items" "center", style "justify-content" "space-between" ]
                [ -- left: selection
                    div [ style "display" "flex", style "gap" "8px", style "align-items" "center" ]
                        [ span [] [ text "Ranking criterion:" ]
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
                    -- right: button link
                , a
                    [ href "#parallele-koordinaten"
                    , style "display" "inline-block"
                    , style "padding" "8px 12px"
                    , style "background-color" "#007cba"
                    , style "color" "#fff"
                    , style "border-radius" "4px"
                    , style "text-decoration" "none"
                    ]
                    [ text "Compare rankings" ]
                ]
            , if model.loading then
                p [] [ text "Loading data..." ]
              else
                case model.error of
                    Just err ->
                        p [ style "color" "#b00020" ] [ text ("Error while loading: " ++ err) ]
                    Nothing ->
                        text ""
            , let
                noteBlock =
                    case selectedId of
                        "pop" -> singleNote "Population criterion uses medals per 1M inhabitants (Med/Pop)."
                        "gdp" -> singleNote "GDP criterion uses medals per $1B GDP (Med/GDP)."
                        "age" -> singleNote "Age criterion uses medals divided by median age (Med/Age)."
                        _ -> text ""
              in
                div [ style "max-width" "950px", style "margin" "8px auto 0", style "text-align" "center", style "color" "#555", style "font-size" "12px" ]
                    (singleTip "Click any table row to select the country and jump to its medal distribution below."
                            :: (case selectedId of
                                        "medals" -> []
                                        _ -> [ noteBlock ]
                                    )
                    )
            , table [ style "width" "100%", style "border-collapse" "collapse" ]
                [ thead []
                    [ tr [ style "background-color" "#007cba", style "color" "white" ]
                        ( [ th [ style "text-align" "left", style "padding" "12px" ] [ text "Rank" ]
                          , th [ style "text-align" "left", style "padding" "12px" ] [ text "Country" ]
                          , th [ style "text-align" "center", style "padding" "12px" ] [ text "Gold" ]
                          , th [ style "text-align" "center", style "padding" "12px" ] [ text "Silver" ]
                          , th [ style "text-align" "center", style "padding" "12px" ] [ text "Bronze" ]
                          , th [ style "text-align" "center", style "padding" "12px" ] [ text "Total" ]
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
                        [ text (if (model.collapseMedalTable == True) then "Show all" else "Show fewer") ]
                ]
            ]
        , div [ style "text-align" "right", style "max-width" "900px", style "margin" "10px auto 0" ]
            [ linkToTop ]
        ]

-- Section 2: Medal distribution
medaillenverteilungSection : Model -> Html Msg
medaillenverteilungSection model =
    let
        -- Helper function: Load all country names
        -- List of (noc, name) pairs, Value = NOC, Display = Country name
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
                [ text "2. Medal Distribution" ]
            , if model.loading then
                p [] [ text "Loading data..." ]
              else
                case model.error of
                    Just err ->
                        p [ style "color" "#b00020" ] [ text ("Error while loading: " ++ err) ]
                    Nothing ->
                        text ""
            , div [] [
                div [style "display" "flex", style "flex-direction" "row", style "justify-content" "space-between"] [
                    div [ style "display" "flex", style "gap" "8px", style "align-items" "center" ] [
                        text "Selected country:"
                        , select [style "width" "180px", onInput ChangeselectedCountry ]
                        ( countries
                            |> List.map (\( noc, name ) ->
                                if noc == model.selectedCountry then
                                    option [ selected True, value noc ] [ text name ]
                                else
                                    option [ value noc ] [ text name ]
                            )
                        )
                    ]
                    , text (String.concat ["Total medals: ", String.fromFloat model.sbmodel.total])
                ]
                , div [style "width" "100%", style "height" "100%"] [
                    if model.sbmodel.total > 0 then
                        div [ style "max-width" "950px", style "margin" "8px auto 0", style "text-align" "center", style "color" "#555", style "font-size" "12px" ]
                            [ singleTip "More details will be displayed when you hover over a category segment." ]
                    else div [] []
                    , sunburst model.sbmodel model.selectedCountry
                ]
            ]
        ]
        , div [ style "text-align" "right", style "max-width" "900px", style "margin" "10px auto 0" ]
            [ linkToTop ]
        ]

-- Section 3: Parallel coordinates
parallelekoordinatensection : Model -> Html Msg
parallelekoordinatensection model =
    div [ id "parallele-koordinaten", style "margin" "60px 0", style "padding" "20px" ]
        [ h2 [ style "margin" "0 0 16px 0" ] [ text "3. Parallel Coordinates" ]
        , let
            axes = model.pcmodel.axes

            series = model.pcmodel.series

            highlighted = if (model.pcCountry == Nothing) then model.pcHover else model.pcCountry

            cfg =
                { width = 950, height = 520, padding = 50 }
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
                            [ text "Drop at start" ]
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
                            [ text "Drop at end" ]
                      ]
                    ])
        , div [ style "max-width" "950px", style "margin" "12px auto 0", style "text-align" "center", style "color" "#555", style "font-size" "12px" ]
            [ multipleTips
                [ "Reorder axes by dragging the axis labels above the chart."
                , "Click an axis label to jump to the medal table and set that criterion."
                , "Hover a line to highlight it and show the country name."
                , "Click a line to lock the highlight (use 'Release focus' to release)."
                ]
            ]
        , div [ style "display" "inline-block"
            , style "padding" "10px 16px"
            , style "background-color" "#007cba"
            , style "color" "#fff"
            , style "border-radius" "4px"
            , style "text-decoration" "none"
            , if (model.pcCountry == Nothing) then style "opacity" "0.4" else style "opacity" "1.0"
            , if (model.pcCountry == Nothing) then style "pointer-event" "none" else style "pointer-event" "all"
            , if (model.pcCountry == Nothing) then style "cursor" "not-allowed" else style "cursor" "pointer"
            , Events.onClick (PcClick Nothing)
            ]
            [ text "Release focus" ]
        , div [ style "display" "flex", style "justify-content" "center" ]
            [ PC.view cfg axes series highlighted ]
        , div [ style "max-width" "750px", style "margin" "8px auto 0", style "text-align" "center", style "color" "#555", style "font-size" "12px" ]
            [ singleNote "EOR (Refugee Olympic Team) and AIN (Individual Neutral Athletes) are not countries. Therefore, there are no values for population, GDP or age, which is why they are not included in this ranking." ]
        ]
    , div [ style "text-align" "right" ] [ linkToTop ]
        ]

-- Section 4: HeatMap
heatmapSection : Model -> Html Msg
heatmapSection model =
    let
        selectedOption = model.heatmapmodel.sortByMedalTable
    in
    div [ id "heatmap", style "margin" "60px 0", style "padding" "20px" ]
        [ div [ style "max-width" "900px", style "margin" "0 auto" ]
            [ h2 [ style "text-align" "left", style "margin-bottom" "20px", style "color" "#333" ]
                [ text "4. Medal Evolution" ]
            , if model.loading then
                p [] [ text "Loading data..." ]
              else
                case model.error of
                    Just err ->
                        p [ style "color" "#b00020" ] [ text ("Error while loading: " ++ err) ]
                    Nothing ->
                        text ""
            , text "Sort by "
            , select [ style "text-decoration" "none", style "cursor" "pointer", Events.onInput (\_ -> ChangeHeatMapSorting) ]
                [ option [ selected (not selectedOption), value "overall"] [ text "Overall-Ranking" ]
                , option [ selected (selectedOption), value "medaltable" ] [ text "2024 Medal Table" ]
                ]
            , div [ style "display" "flex", style "flex-direction" "column", style "align-items" "center", style "gap" "12px" ]
                [ div [ style "text-align" "center", style "font-size" "12px", style "color" "#555" ]
                    [ singleTip "Hover cells to see values." ]
                , heatmap model.heatmapmodel
                ]
            ]
        , div [ style "text-align" "right", style "max-width" "900px", style "margin" "10px auto 0" ]
            [ linkToTop ]
        ]


-- "Back to top" CTA as styled link
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
        [ text "Back to top" ]



