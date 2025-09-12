module Components.Sunburst exposing (sunburst)

import Color exposing (Color)
import Html exposing (Html)
import List.Extra
import Path exposing (Path)
import Scale
import Scale.Color
import Shape
import Svg.Lazy
import TypedSvg exposing (g, svg, text_)
import TypedSvg.Attributes exposing (fill, textAnchor, transform, viewBox)
import TypedSvg.Attributes.InPx exposing (y)
import TypedSvg.Core exposing (Svg, text)
import TypedSvg.Events
import TypedSvg.Types exposing (AnchorAlignment(..), Opacity(..), Paint(..), Transform(..))

import Model exposing (..)
import Helpers exposing (nocToCountry)


-- Constants


sb_w : Float
sb_w =
    600


sb_h : Float
sb_h =
    550


radius : Float
radius =
    min sb_w sb_h / 2

-- Make arcs colorfull
mapColor : SBTreeData -> List String -> Color
mapColor data range =
    let
        colors = List.range 0 (List.length range)
                |> List.map (\i -> Scale.Color.rainbowInterpolator (toFloat i / toFloat (List.length range)))
        color =
            Scale.convert (Scale.ordinal colors range) (List.head data.sequence |> Maybe.withDefault "")
            |> Maybe.withDefault Color.black
            |> Color.toRgba
        darkConst = (9 - (List.length data.sequence |> toFloat)) * 0.125
    in
    Color.rgb (color.red * darkConst) (color.green * darkConst) (color.blue * darkConst)

sunburst : SBModel -> String -> Html Msg
sunburst sbmodel country =
    let
        format f =
            String.left 5 (String.fromFloat f) ++ "%"
        range =
            sbmodel.layout
                |> List.map (\l -> List.head l.node.sequence |> Maybe.withDefault "")
                |> List.Extra.unique
    in
    svg [ viewBox 0 0 sb_w sb_h ]
        [ g [ transform [ Translate (sb_w / 2) 200] ]
            [ g []
                (sbmodel.layout
                    |> List.map
                        (\item ->
                            Path.element (arc item)
                                [ fill (Paint (mapColor item.node range)) ]
                        )
                )
            , Svg.Lazy.lazy2 mouseInteractionArcs sbmodel.layout sbmodel.total
            , case sbmodel.hovered of
                Just { percentage, sequence } ->
                    g [ textAnchor AnchorMiddle, TypedSvg.Attributes.fontFamily [ "sans-serif" ], fill (Paint (Color.rgb 0.5 0.5 0.5)) ]
                        (text_ [ TypedSvg.Attributes.InPx.fontSize 28, y -20 ] [ text (format percentage) ]
                        :: (List.indexedMap (\i s -> text_ [ TypedSvg.Attributes.InPx.fontSize (18 - ((toFloat i) * 4)), y (toFloat i * 20) ] [ text s ]) sequence))

                Nothing ->
                    g [ textAnchor AnchorMiddle, TypedSvg.Attributes.fontFamily [ "sans-serif" ], fill (Paint (Color.rgb 0.5 0.5 0.5)) ]
                        (if sbmodel.total == 0 then
                                [ text_ [ TypedSvg.Attributes.InPx.fontSize 15, y 15 ] [ text (String.concat [nocToCountry country, " hat keine Medaillen gewonnen"]) ]]
                        else
                                [ text_ [ TypedSvg.Attributes.InPx.fontSize 20, y 10 ] [ text (nocToCountry country) ] ])
            ]
        ]


mouseInteractionArcs : List LayedOutDatum -> Float -> Svg Msg
mouseInteractionArcs segments total =
    g [ TypedSvg.Attributes.pointerEvents "all", TypedSvg.Events.onMouseLeave (HoverSB Nothing) ]
        (segments
            |> List.map
                (\item ->
                    Path.element (mouseArc item)
                        [ fill PaintNone
                        , TypedSvg.Events.onMouseEnter
                            (HoverSB
                                (Just
                                    { sequence = item.node.sequence
                                    , percentage = (10000 * item.value / total |> round |> (\n -> toFloat n / 100))
                                    }
                                )
                            )
                        ]
                )
        )

arc : LayedOutDatum -> Path
arc s =
    Shape.arc
        { innerRadius = sqrt s.y
        , outerRadius = sqrt (s.y + s.height) - 1
        , cornerRadius = 0
        , startAngle = s.x
        , endAngle = s.x + s.width
        , padAngle = 1 / radius
        , padRadius = radius
        }


mouseArc : LayedOutDatum -> Path
mouseArc s =
    Shape.arc
        { innerRadius = sqrt s.y
        , outerRadius = radius
        , cornerRadius = 0
        , startAngle = s.x
        , endAngle = s.x + s.width
        , padAngle = 0
        , padRadius = 0
        }
