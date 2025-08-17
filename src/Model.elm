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

type alias LandMedaillen =
    { land : String
    , gold : Int
    , silber : Int
    , bronze : Int
    }

mockData : List LandMedaillen
mockData =
    [ { land = "USA", gold = 40, silber = 44, bronze = 42 }
    , { land = "China", gold = 40, silber = 27, bronze = 24 }
    , { land = "Japan", gold = 20, silber = 12, bronze = 13 }
    , { land = "Australien", gold = 18, silber = 19, bronze = 16 }
    , { land = "Frankreich", gold = 16, silber = 26, bronze = 22 }
    ]
