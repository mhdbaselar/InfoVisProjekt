module View exposing (..)

import Html exposing (Html, div, h1, h2, h3, text, a, img, p, table, thead, tbody, tr, th, td, select, option)
import Html.Attributes exposing (href, src, alt, style, id, selected)
import Set
import Components.Sunburst exposing (sunburst)
import Model exposing (..)

view : Model -> Html Msg
view model =
    div [ style "font-family" "Arial, sans-serif" ]
        [ -- Header mit Navigation
          headerSection
        , -- Visualisierungen untereinander
          div [ style "max-width" "1200px", style "margin" "0 auto", style "padding" "20px" ]
            [ medaillenspiegelSection model
            , medaillenverteilungSection model
            , visualisierung3
            , visualisierung4
            ]
        ]

-- Header mit Navigation und Olympischen Ringen
headerSection : Html Msg
headerSection =
    div [ style "text-align" "center", style "padding" "20px", style "background-color" "#f8f9fa" ]
        [ -- Navigation
          div [ style "margin-bottom" "20px" ]
            [ a [ href "#medaillenspiegel", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ]
                [ text "Medaillenspiegel" ]
            , text " | "
            , a [ href "#medaillenverteilung", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ]
                [ text "Medaillenverteilung" ]
            , text " | "
            , a [ href "#visualisierung3", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ]
                [ text "Visualisierung 3" ]
            , text " | "
            , a [ href "#visualisierung4", style "margin" "0 15px", style "text-decoration" "none", style "color" "#007cba", style "font-weight" "bold" ]
                [ text "Visualisierung 4" ]
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
        totalMed r = r.gold + r.silver + r.bronze

        sortedRows =
            model.countryMedals
                |> List.sortWith (\a b ->
                    case compare b.gold a.gold of
                        EQ ->
                            case compare b.silver a.silver of
                                EQ ->
                                    compare b.bronze a.bronze
                                ord -> ord
                        ord -> ord
                )
    in
    div [ id "medaillenspiegel", style "margin" "60px 0", style "padding" "20px" ]
        [ div [ style "max-width" "900px", style "margin" "0 auto" ]
            [ h2 [ style "text-align" "left", style "margin-bottom" "20px", style "color" "#333" ]
                [ text "1. Medaillenspiegel" ]
            , if model.loading then
                p [] [ text "Lade Daten..." ]
              else
                case model.error of
                    Just err ->
                        p [ style "color" "#b00020" ] [ text ("Fehler beim Laden: " ++ err) ]
                    Nothing ->
                        text ""
            , table [ style "width" "100%", style "border-collapse" "collapse" ]
                [ thead []
                    [ tr [ style "background-color" "#007cba", style "color" "white" ]
                        [ th [ style "text-align" "left", style "padding" "12px" ] [ text "Platz" ]
                        , th [ style "text-align" "left", style "padding" "12px" ] [ text "Land" ]
                        , th [ style "text-align" "center", style "padding" "12px" ] [ text "Gold" ]
                        , th [ style "text-align" "center", style "padding" "12px" ] [ text "Silber" ]
                        , th [ style "text-align" "center", style "padding" "12px" ] [ text "Bronze" ]
                        , th [ style "text-align" "center", style "padding" "12px" ] [ text "Gesamt" ]
                        ]
                    ]
                , tbody []
                    (sortedRows
                        |> List.indexedMap
                            (\i r ->
                                tr [ style "border-bottom" "1px solid #ddd" ]
                                    [ td [ style "padding" "10px" ] [ text (String.fromInt (i + 1)) ]
                                    , td [ style "padding" "10px", style "font-weight" "bold" ] [ text r.country ]
                                    , td [ style "padding" "10px", style "text-align" "center" ] [ text (String.fromInt r.gold) ]
                                    , td [ style "padding" "10px", style "text-align" "center" ] [ text (String.fromInt r.silver) ]
                                    , td [ style "padding" "10px", style "text-align" "center" ] [ text (String.fromInt r.bronze) ]
                                    , td [ style "padding" "10px", style "text-align" "center", style "font-weight" "bold" ] [ text (String.fromInt (totalMed r)) ]
                                    ]
                            )
                    )
                ]
            ]
        , div [ style "text-align" "right", style "max-width" "900px", style "margin" "10px auto 0" ]
            [ nextLink "#medaillenverteilung" ]
        ]

-- Sektion 2: Medaillenverteilung
medaillenverteilungSection : Model -> Html Msg
medaillenverteilungSection model =
    let
        -- Hilfsfunktion: Alle Ländernamen laden
        countries : List String
        countries =
            model.participations
            |> List.map (\p -> if p.team /= "" then p.team else p.noc)
            |> Set.fromList
            |> Set.toList
            
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
            , div [style "display" "flex", style "flex-direction" "row", style "align-items" "flex-start"] [
                sunburst model.sbmodel
                , div [style "width" "300px", style "display" "flex", style "flex-direction" "column", style "align-items" "center"] [
                    h3 [] [ text "Selected Country" ]
                    , select [style "width" "150px"]
                        ( List.map (\p -> if p == "Germany" then option [selected True] [ text p ] else option [] [ text p ]) countries)
                    ]
                ]
            ]
        , div [ style "text-align" "right", style "max-width" "900px", style "margin" "10px auto 0" ]
            [ nextLink "#visualisierung3" ]
        ]

-- Sektion 3: Visualisierung 3
visualisierung3 : Html Msg
visualisierung3 =
    div [ id "visualisierung3", style "margin" "60px 0", style "padding" "20px" ]
        [ h2 [ style "margin" "0 0 16px 0" ] [ text "3. Visualisierung" ]
        , div [ style "text-align" "right" ] [ nextLink "#visualisierung4" ]
        ]

-- Sektion 4: Visualisierung 4
visualisierung4 : Html Msg
visualisierung4 =
    div [ id "visualisierung4", style "margin" "60px 0", style "padding" "20px", style "background-color" "#f8f9fa" ]
        [ h2 [ style "margin" "0 0 16px 0" ] [ text "4. Visualisierung" ]
        , div [ style "text-align" "right" ] [ nextLink "#medaillenspiegel" ]
        ]


-- "Weiter" CTA as styled link
nextLink : String -> Html msg
nextLink target =
    a
        [ href target
        , style "display" "inline-block"
        , style "padding" "10px 16px"
        , style "background-color" "#007cba"
        , style "color" "#fff"
        , style "border-radius" "4px"
        , style "text-decoration" "none"
        ]
        [ text "Weiter" ]


