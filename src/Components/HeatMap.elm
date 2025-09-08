module Components.HeatMap exposing (heatmap)

import Color exposing (..)
import Scale exposing (ContinuousScale)
import Statistics
import Scale.Color
import Html
import Html.Attributes
import Html.Events
import Json.Encode
import Model exposing (Msg, Cell)
import String exposing (fromFloat)
import Model exposing (Msg(..), HMModel)


-- Precompute normalization scale for 0..50 once
scale0to50 : ContinuousScale Float
scale0to50 =
    List.range 0 50
        |> List.map toFloat
        |> normalize


normalize : List ( Float ) -> ContinuousScale Float
normalize data =
    data
        |> Statistics.extent
        |> Maybe.withDefault ( 0, 1 )
        |> Scale.linear ( 0, 1 )

colorSchemeGet : Float -> Color
colorSchemeGet cellValue =
    if isNaN cellValue then
        Color.blue
    else
        if cellValue > 50 then
            Scale.Color.lightMultiInterpolator 1.0
        else
            cellValue
                |> Scale.convert scale0to50
                |> Scale.Color.lightMultiInterpolator

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
        [ Html.Attributes.style "width" "500px"
        , Html.Attributes.style "height" "540px"
        , Html.Attributes.style "border" "solid 1px black"
        , Html.Attributes.style "padding" "8px"
        , Html.Attributes.style "box-sizing" "border-box"
        ]
        [ drawCells quadHeatMapCells hmmodel
        , Html.div [ Html.Attributes.style "margin-top" "8px" ] [ legend hmmodel ]
        ]


legend : HMModel -> Html.Html Msg
legend _ =
    let
        -- We use the same 0..50 normalization window as in colorSchemeGet
        ticks : List Float
        ticks = List.range 0 10 |> List.map (\i -> toFloat (i * 5))

        swatch v =
            Html.div
                [ Html.Attributes.style "width" "24px"
                , Html.Attributes.style "height" "12px"
                , Html.Attributes.style "display" "inline-block"
                , Html.Attributes.style "background-color" (Color.toCssString (colorSchemeGet v))
                ]
                []
    in
    Html.div []
        [ Html.div [ Html.Attributes.style "font-size" "12px", Html.Attributes.style "color" "#555", Html.Attributes.style "margin-bottom" "4px" ]
            [ Html.text "Legend (medals per cell, 0 … 50+)" ]
        , Html.div [ Html.Attributes.style "display" "flex", Html.Attributes.style "align-items" "center", Html.Attributes.style "gap" "6px" ]
            (Html.span [ Html.Attributes.style "font-size" "11px", Html.Attributes.style "color" "#555" ] [ Html.text "0" ]
                :: (List.map swatch ticks
                ++ [ Html.span [ Html.Attributes.style "font-size" "11px", Html.Attributes.style "color" "#555" ] [ Html.text "50+" ] ])
            )
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

        cellHeight =
            (1 + List.length quadHeatMapCells)
            |> toFloat
            |> (\hei -> fromFloat (100 / hei) ++ "%")

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
                            darkConst = 0.75
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
                [ Html.Attributes.style "height" cellHeight ]
                (List.map (\text ->
                    Html.td
                    [ Html.Attributes.style "font-size" "60%"
                    , Html.Attributes.style "text-align" "center"
                    ]
                    [ Html.text text ])
                ("" :: labels))


        firstColumn rowIndex =
            let
                labelText =
                    hmmodel.rowLabels
                        |> List.drop rowIndex
                        |> List.head
                        |> Maybe.withDefault ""
            in
            [ Html.td
                [ Html.Attributes.style "font-size" "60%"
                , Html.Attributes.style "text-align" "right"
                ]
                [ Html.text labelText ]
            ]

        toTableRow rowIndex cellList =
            Html.tr
                [ Html.Attributes.style "height" cellHeight ]
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
        , Html.Attributes.style "height" "100%"
        , Html.Attributes.style "border-collapse" "collapse"
        ]
        [ Html.colgroup []
            ((Html.col [Html.Attributes.style "width" "15%"] []) :: (List.repeat maxRowLength (Html.col [Html.Attributes.style "width" cellWidth] [])))
        , Html.tbody
            [ Html.Attributes.style "width" "100%"
            , Html.Attributes.style "height" "100%"
            ]
            rows
        ]
