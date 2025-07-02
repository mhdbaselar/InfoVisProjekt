module View exposing (..)

import Html exposing (Html, div, h1, text, button, input)
import Html.Attributes exposing (placeholder)
import Html.Events exposing (onClick, onInput)
import Model exposing (..)

view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text model.message ]
        , input
            [ placeholder "Gib eine neue Nachricht ein..."
            , onInput ChangeMessage
            ]
            []
        , div []
            [ button
                [ onClick (ChangeMessage "Hello World!") ]
                [ text "Hello World!" ]
            , button
                [ onClick (ChangeMessage "Hallo Welt!") ]
                [ text "Hallo Welt!" ]
            ]
        ]

