module Model exposing (..)

type alias Model =
    { message : String
    }

init : Model
init =
    { message = "Hello World!"
    }

type Msg
    = ChangeMessage String
