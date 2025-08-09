module View exposing (..)

import Html exposing (Html, div, h1, text, a, img, p)
import Html.Attributes exposing (href, src, alt, style, id)
import Model exposing (..)

view : Model -> Html Msg
view model =
    div [ style "font-family" "Arial, sans-serif" ]
        [ -- Header mit Navigation
          headerSection
        , -- Visualisierungen untereinander
          div [ style "max-width" "1200px", style "margin" "0 auto", style "padding" "20px" ]
            [ medaillenspiegelSection
            , medaillenverteilungSection
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
medaillenspiegelSection : Html Msg
medaillenspiegelSection =
    div [ id "medaillenspiegel", style "margin" "60px 0", style "padding" "20px" ]
        [
        ]

-- Sektion 2: Medaillenverteilung
medaillenverteilungSection : Html Msg
medaillenverteilungSection =
    div [ id "medaillenverteilung", style "margin" "60px 0", style "padding" "20px", style "background-color" "#f8f9fa" ]
        [
        ]

-- Sektion 3: Visualisierung 3
visualisierung3 : Html Msg
visualisierung3 =
    div [ id "visualisierung3", style "margin" "60px 0", style "padding" "20px" ]
        [
        ]

-- Sektion 4: Visualisierung 4
visualisierung4 : Html Msg
visualisierung4 =
    div [ id "visualisierung4", style "margin" "60px 0", style "padding" "20px", style "background-color" "#f8f9fa" ]
        [
        ]

