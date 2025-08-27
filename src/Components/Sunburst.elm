module Components.Sunburst exposing (sunburst)

import Color exposing (Color)
import Hierarchy
import Html exposing (Html)
import List.Extra
import Path exposing (Path)
import Scale exposing (OrdinalScale)
import Scale.Color
import Set
import Shape
import Svg.Lazy
import Tree exposing (Tree)
import TypedSvg exposing (g, svg, text_)
import TypedSvg.Attributes exposing (fill, textAnchor, transform, viewBox)
import TypedSvg.Attributes.InPx exposing (y)
import TypedSvg.Core exposing (Svg, text)
import TypedSvg.Events
import TypedSvg.Types exposing (AnchorAlignment(..), Opacity(..), Paint(..), Transform(..), em)

import Model exposing (..)


-- Constants


sb_w : Float
sb_w =
    400


sb_h : Float
sb_h =
    350


radius : Float
radius =
    min sb_w sb_h / 2

-- Make arcs colorfull
colorScale : OrdinalScale String Color
colorScale =
    -- TODO: add sports
    Scale.ordinal (Color.rgb 0.5 0.5 0.5 :: Scale.Color.tableau10) [ "Swimming", "Athletics" ]

sunburst : SBModel -> Html Msg
sunburst sbmodel =
    let
        _ = -- update sbmodel
            case sbmodel.hovered of
                Just { sequence } ->
                    List.Extra.inits sequence
                        |> Set.fromList

                Nothing ->
                    Set.empty

        format f =
            String.left 5 (String.fromFloat f) ++ "%"
    in
    svg [ viewBox 0 0 sb_w sb_h ]
        [ g [ transform [ Translate radius radius ] ]
            [ g []
                (sbmodel.layout
                    |> List.map
                        (\item ->
                            Path.element (arc item)
                                [ fill (Paint (Scale.convert colorScale item.node.category |> Maybe.withDefault Color.black)) ]
                        )
                )
            , Svg.Lazy.lazy2 mouseInteractionArcs sbmodel.layout sbmodel.total
            , case sbmodel.hovered of
                Just { percentage, sequence } ->
                    g [ textAnchor AnchorMiddle, TypedSvg.Attributes.fontFamily [ "sans-serif" ], fill (Paint (Color.rgb 0.5 0.5 0.5)) ]
                        [ text_ [ TypedSvg.Attributes.InPx.fontSize 28, y -8 ] [ text (format percentage) ]
                        , text_ [] [ text (List.Extra.last sequence |> Maybe.withDefault "") ]
                        ]

                Nothing ->
                    text ""
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
                                    , percentage = 100 * item.value / total
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