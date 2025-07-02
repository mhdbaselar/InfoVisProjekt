module Update exposing (..)

import Model exposing (..)

update : Msg -> Model -> Model
update msg model =
    case msg of
        ChangeMessage newMessage ->
            { model | message = newMessage }
