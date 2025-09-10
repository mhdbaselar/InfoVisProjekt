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
    500


sb_h : Float
sb_h =
    450


radius : Float
radius =
    min sb_w sb_h / 2

-- Make arcs colorfull
sportCats : List String
sportCats =
    [ "Aquatics"
    , "AquaticsSwimming"
    , "Athletics"
    , "Basketball"
    , "Boxing"
    , "Cycling"
    , "Gymnastics"
    , "Judo"
    , "Equestrian"
    , "Canoeing"
    ]

colorScale : OrdinalScale String Color
colorScale =
    -- TODO: add sports
    Scale.ordinal (Color.rgb 0.5 0.5 0.5 :: Scale.Color.tableau10) sportCats

sunburst : SBModel -> String -> Html Msg
sunburst sbmodel country =
    let
        format f =
            String.left 5 (String.fromFloat f) ++ "%"
    in
    svg [ viewBox 0 0 sb_w sb_h ]
        [ g [ transform [ Translate (sb_w / 2) (sb_h / 2)] ]
            [ g []
                (sbmodel.layout
                    |> List.map
                        (\item ->
                            Path.element (arc item)
                                [ fill (Paint (Scale.convert colorScale (String.concat item.node.sequence) |> Maybe.withDefault Color.black)) ]
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
                                [ text_ [ TypedSvg.Attributes.InPx.fontSize 15, y 15 ] [ text (String.concat [country, " hat keine Medaillen gewonnen"]) ]]
                        else
                                [ text_ [ TypedSvg.Attributes.InPx.fontSize 20, y 10 ] [ text country ] ])
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