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
                            let
                                filteredParts =
                                    parts |> filterByYear 2024 |> filterSportsEventMedal
                            in
                            ( { model
                                    | participations = filteredParts
                                    , countryMedals = toCountryMedals filteredParts
                                    , sbmodel = toSBModel filteredParts "Germany"
                                    , loading = False
                                    , error = Nothing
                                }
                            , Cmd.none
                            )
                        Err decodeErr ->
                            ( { model | loading = False, error = Just decodeErr }, Cmd.none )

                Err httpErr ->
                    ( { model | loading = False, error = Just (httpErrorToString httpErr) }, Cmd.none )
        HoverSB hover ->
            let
                modelSB = model.sbmodel
                updateSBData = { modelSB | hovered = hover }
            in
            ( { model | sbmodel = updateSBData }, Cmd.none )
        ChangeSBCountry country ->
            ( { model | sbcountry = country, sbmodel = toSBModel model.participations country }, Cmd.none )

httpErrorToString : Http.Error -> String
httpErrorToString err =
    case err of
        Http.BadUrl u -> "BadUrl: " ++ u
        Http.Timeout -> "Timeout"
        Http.NetworkError -> "NetworkError"
        Http.BadStatus s -> "BadStatus: " ++ String.fromInt s
        Http.BadBody msg -> "BadBody: " ++ msg
