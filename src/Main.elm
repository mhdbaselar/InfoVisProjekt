module Main exposing (..)

import Browser
import Model exposing (init, Model, Msg)
import Update exposing (update)
import View exposing (view)


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , view = view
        , update = update
        }
