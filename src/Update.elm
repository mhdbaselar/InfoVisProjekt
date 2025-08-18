module Update exposing (..)

import Model exposing (..)
import Http

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DataReceived result ->
            case result of
                Ok body ->
                    case decodeCsv body of
                        Ok parts ->
                            ( { model
                                    | medaillen = parts |> filterByYear 2024 |> toMedaillen
                                    , loading = False
                                    , error = Nothing
                                }
                            , Cmd.none
                            )
                        Err decodeErr ->
                            ( { model | loading = False, error = Just decodeErr }, Cmd.none )

                Err httpErr ->
                    ( { model | loading = False, error = Just (httpErrorToString httpErr) }, Cmd.none )

httpErrorToString : Http.Error -> String
httpErrorToString err =
    case err of
        Http.BadUrl u -> "BadUrl: " ++ u
        Http.Timeout -> "Timeout"
        Http.NetworkError -> "NetworkError"
        Http.BadStatus s -> "BadStatus: " ++ String.fromInt s
        Http.BadBody msg -> "BadBody: " ++ msg
