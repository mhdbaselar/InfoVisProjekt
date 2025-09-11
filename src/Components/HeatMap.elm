module Components.HeatMap exposing (heatmap)

import Color exposing (..)
import Html
import Html.Attributes
import Html.Events
import Json.Encode
import Model exposing (Msg, Cell)
import String exposing (fromFloat)
import Model exposing (Msg(..), HMModel)
import Helpers exposing (..)
import Char
import Svg exposing (text_)



-- Diskrete Farbskala
-- Schwellen: 0,1,2,5,10,20,30,40,50+
colorSteps : List ( Float, Color )
colorSteps =
    [ ( 0,  Color.rgb255 250 250 250 ) -- 0 (weiß)
    , ( 1,  Color.rgb255 255 220 200 ) -- 1 (dunkler)
    , ( 2,  Color.rgb255 255 200 170 )
    , ( 5,  Color.rgb255 255 170 120 )
    , ( 10, Color.rgb255 255 120 70 )
    , ( 20, Color.rgb255 240 70 30 )
    , ( 30, Color.rgb255 200 40 20 )
    , ( 40, Color.rgb255 170 20 10 )
    , ( 50, Color.rgb255 140 0 0 ) -- 50+
    ]

colorSchemeGet : Float -> Color
colorSchemeGet v =
    if isNaN v then
        Color.rgb255 200 200 200
    else
        let
            pick =
                colorSteps
                    |> List.filter (\(t, _) -> v >= t)
                    |> List.reverse
                    |> List.head
                    |> Maybe.map Tuple.second
        in
        Maybe.withDefault (Color.rgb255 140 0 0) pick

heatmap : HMModel -> Html.Html Msg
heatmap hmmodel =
    let
        maxRowLength =
            hmmodel.data
                |> List.map List.length
                |> List.maximum
                |> Maybe.withDefault 1

        quadHeatMapCells =
            hmmodel.data
                |> List.map (List.map (\v -> Just {value=v, message= (String.fromFloat v), column=0, row=0}))
                |> List.map
                    (\row ->
                        -- add missing cells to make it quadratic
                        let
                            missingCells =
                                maxRowLength - List.length row
                        in
                        if missingCells > 0 then
                            List.append row <| List.repeat missingCells Nothing

                        else
                            row
                    )
    in
    Html.div
    [ Html.Attributes.style "width" "100%"
    , Html.Attributes.style "max-width" "100%"
    , Html.Attributes.style "border" "solid 1px black"
    , Html.Attributes.style "padding" "8px"
    , Html.Attributes.style "box-sizing" "border-box"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "row"
    , Html.Attributes.style "gap" "8px"
    , Html.Attributes.style "overflow-x" "auto"
    ]
    [ Html.div [Html.Attributes.style "height" "80vh", Html.Attributes.style "overflow-y" "scroll" , Html.Attributes.style "padding-right" "10px"]
        [ drawCells quadHeatMapCells hmmodel ]
    , legend hmmodel
    ]


legend : HMModel -> Html.Html Msg
legend _ =
    let
        swatch ( v, c ) =
            let
                labelText = if v == 50 then "50+" else String.fromFloat v |> String.split "." |> List.head |> Maybe.withDefault (String.fromFloat v)
            in
            Html.div
                [ Html.Attributes.style "display" "flex"
                , Html.Attributes.style "flex-direction" "column"
                , Html.Attributes.style "align-items" "center"
                , Html.Attributes.style "gap" "2px"
                , Html.Attributes.style "min-width" "32px"
                ]
                [ Html.div
                    [ Html.Attributes.style "width" "20px"
                    , Html.Attributes.style "height" "16px"
                    , Html.Attributes.style "border" "1px solid #ccc"
                    , Html.Attributes.style "background-color" (Color.toCssString c)
                    ]
                    []
                , Html.span [ Html.Attributes.style "font-size" "10px", Html.Attributes.style "color" "#555" ] [ Html.text labelText ]
                ]
    in
    Html.div [ Html.Attributes.style "max-width" "55px" ]
        [ Html.div [ Html.Attributes.style "font-size" "12px", Html.Attributes.style "color" "#555", Html.Attributes.style "margin-bottom" "4px", Html.Attributes.style "text-align" "center" ]
            [ Html.h3 [ Html.Attributes.style "margin-bottom" "0" ] [ Html.text "Legende"]
            , Html.text "Anzahl Medaillen (diskrete Stufen)" ]
        , Html.div [ Html.Attributes.style "display" "flex", Html.Attributes.style "justify-content" "center", Html.Attributes.style "gap" "4px", Html.Attributes.style "flex-wrap" "wrap" ]
            (List.map swatch colorSteps)
        ]

emptyCellContent : Html.Html Msg
emptyCellContent =
    Html.div [ Html.Attributes.style "height" "1px" ] [
        Html.span [ Html.Attributes.property "innerHTML" (Json.Encode.string "&nbsp;") ] []
    ]

drawCells : List (List (Maybe Cell)) -> HMModel -> Html.Html Msg
drawCells quadHeatMapCells hmmodel =
    let
        maxRowLength =
            quadHeatMapCells
                |> List.map List.length
                |> List.maximum
                |> Maybe.withDefault 1

        fillColor row col cellvalue =
            let
                color =
                    colorSchemeGet cellvalue
            in
            (case hmmodel.selected of
                Just cellWithPosition ->
                    if row == cellWithPosition.row && col == cellWithPosition.column then
                        let
                            rgb = Color.toRgba  color
                            darkConst = 0.65
                        in
                        Color.rgb (rgb.red * darkConst) (rgb.green * darkConst) (rgb.blue * darkConst)

                    else if row == cellWithPosition.row || col == cellWithPosition.column then
                        let
                            rgb = Color.toRgba  color
                            darkConst = 0.85
                        in
                        Color.rgb (rgb.red * darkConst) (rgb.green * darkConst) (rgb.blue * darkConst)
                    else
                        color

                Nothing ->
                    color
            )
            |> Color.toCssString

        firstRowLabels labels =
            Html.tr
                [ Html.Attributes.style "height" "20px" ]
                (List.indexedMap (\i text ->
                    Html.td
                    [ Html.Attributes.style "font-size" "60%"
                    , Html.Attributes.style "text-align" "center"
                    , case hmmodel.selected of
                        Just cellWithPosition ->
                            if (cellWithPosition.column == i-1) then
                                Html.Attributes.style "font-weight" "bold"
                            else
                                Html.Attributes.style "font-weight" "normal"
                        Nothing ->
                            Html.Attributes.style "font-weight" "normal"
                    ]
                    [ Html.text text ])
                ("" :: labels))


        firstColumn rowIndex =
            let
                rawLabel =
                    hmmodel.rowLabels
                        |> List.drop rowIndex
                        |> List.head
                        |> Maybe.withDefault ""

                isAllUpper s =
                    let chars = String.toList s in
                    List.all Char.isUpper chars

                labelText =
                    if String.length rawLabel == 3 && isAllUpper rawLabel then
                        nocToCountry rawLabel
                    else
                        rawLabel
            in
            [ Html.td
                [ Html.Attributes.style "font-size" "60%"
                , Html.Attributes.style "text-align" "right"
                , case hmmodel.selected of
                    Just cellWithPosition ->
                        if (cellWithPosition.row == rowIndex) then
                            Html.Attributes.style "font-weight" "bold"
                        else
                            Html.Attributes.style "font-weight" "normal"
                    Nothing ->
                        Html.Attributes.style "font-weight" "normal"
                ]
                [ Html.text labelText ] 
            ]

        toTableRow rowIndex cellList =
            Html.tr
                [ Html.Attributes.style "height" "20px" ]
                (firstColumn rowIndex
                    ++ List.indexedMap
                        (\col ->
                            \cell ->
                                case cell of
                                    Just c ->
                                        Html.td (cellAttributes rowIndex col c) [ emptyCellContent ]

                                    Nothing ->
                                        Html.td
                                            [ Html.Attributes.style "background-color" "#000000ff"
                                            , Html.Attributes.style "border" "2px solid black"
                                            ]
                                            [ emptyCellContent ]
                        )
                        cellList
                )

        cellAttributes row col cell =
            [ Html.Attributes.style "background-color" (fillColor row col cell.value)
            , Html.Attributes.style "border" "2px solid black"
            , Html.Attributes.title cell.message
            , Html.Events.onMouseOver (OnHoverHeatMap {value=cell.value, row=row, column=col, message=cell.message})
            , Html.Events.onMouseLeave OnLeaveHeatMap
            ]


        rows =
            quadHeatMapCells
                |> List.indexedMap toTableRow
                |> (\tableRows -> firstRowLabels hmmodel.columnLabels :: tableRows)

        cellWidth =
            fromFloat (75 / toFloat maxRowLength) ++ "%"
    in
    Html.table
        [ Html.Attributes.style "width" "100%"
        , Html.Attributes.style "height" "auto"
        , Html.Attributes.style "border-collapse" "collapse"
        ]
        [ Html.colgroup []
            ((Html.col [Html.Attributes.style "width" "15%"] []) :: (List.repeat maxRowLength (Html.col [Html.Attributes.style "width" cellWidth] [])))
        , Html.tbody
            [ Html.Attributes.style "width" "100%"
            , Html.Attributes.style "height" "auto"
            ]
            rows
        ]
