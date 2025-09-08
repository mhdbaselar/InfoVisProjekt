module Update exposing (..)

import Model exposing (..)
import Http
import Dict
import List.Extra as ListExtra

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OlympiaReceived result ->
            case result of
                Ok body ->
                    case decodeOlympiaCsv body of
                        Ok parts ->
                            let
                                filteredParts =
                                    parts |> filterByYear 2024 |> filterSportsEventMedal
                                mt = toMedalTable filteredParts
                                base =
                                    { model
                                        | participations = filteredParts
                                        , medalTable = mt
                                        , sbcountry = if model.sbcountry == "" then "Germany" else model.sbcountry
                                        , sbmodel = toSBModel filteredParts (if model.sbcountry == "" then "Germany" else model.sbcountry)
                                        , heatmapmodel = toHMModel parts
                                        , loading = False
                                        , error = Nothing
                                    }
                            in
                            ( recomputePcModel base, Cmd.none )
                        Err decodeErr ->
                            ( { model | loading = False, error = Just decodeErr }, Cmd.none )

                Err httpErr ->
                    ( { model | loading = False, error = Just (httpErrorToString httpErr) }, Cmd.none )

        PopulationReceived result ->
            case result of
                Ok body ->
                    case decodePopulationCsv body of
                        Ok rows ->
                            let
                                dict =
                                    rows
                                        |> List.map (\r -> ( r.country, { population = r.population, medianAge = r.medianAge } ))
                                        |> Dict.fromList
                                -- Manuelle Overrides anwenden (Overrides haben Vorrang)
                                merged = Dict.union manualPopulationOverrides dict
                                base = { model | populationByCountry = merged }
                            in
                            ( recomputePcModel base, Cmd.none )

                        Err errStr ->
                            ( { model | error = Just errStr }, Cmd.none )

                Err httpErr ->
                    ( { model | error = Just (httpErrorToString httpErr) }, Cmd.none )

        GdpReceived result ->
            case result of
                Ok body ->
                    case decodeGdpCsv body of
                        Ok rows ->
                            let
                                dict =
                                    rows
                                        |> List.map (\r -> ( r.country, r.gdp ))
                                        |> Dict.fromList
                                -- Manuelle Overrides anwenden (Overrides haben Vorrang)
                                merged = Dict.union manualGdpOverrides dict
                                base = { model | gdpByCountry = merged }
                            in
                            ( recomputePcModel base, Cmd.none )

                        Err errStr ->
                            ( { model | error = Just errStr }, Cmd.none )

                Err httpErr ->
                    ( { model | error = Just (httpErrorToString httpErr) }, Cmd.none )
        HoverSB hover ->
            let
                modelSB = model.sbmodel
                updateSBData = { modelSB | hovered = hover }
            in
            ( { model | sbmodel = updateSBData }, Cmd.none )
        ChangeSBCountry country ->
            ( { model | sbcountry = country, sbmodel = toSBModel model.participations country }, Cmd.none )
        SelectCountryFromTable country ->
            ( { model | sbcountry = country, sbmodel = toSBModel model.participations country }, Cmd.none )
        HoverMedalTable name ->
            ( { model | hoverTable = name }, Cmd.none )
        NoOp ->
            ( model, Cmd.none )
        SetTableCriterion crit ->
            ( { model | tableCriterion = crit }, Cmd.none )
        StartDragAxis axisId ->
            ( { model | draggingAxis = Just axisId }, Cmd.none )
        DragOverAxis axisId ->
            ( { model | dropTargetAxis = Just axisId }, Cmd.none )
        DropAxis targetId ->
            let
                newOrder =
                    case model.draggingAxis of
                        Nothing ->
                            model.axisOrder

                        Just src ->
                            if src == targetId then
                                model.axisOrder
                            else
                                let
                                    without = List.filter ((/=) src) model.axisOrder
                                    srcIndex = Maybe.withDefault 0 (ListExtra.elemIndex src model.axisOrder)
                                in
                                if targetId == "__end__" then
                                    without ++ [ src ]
                                else if targetId == "__start__" then
                                    src :: without
                                else
                                    let
                                        targetIndexOriginal = Maybe.withDefault 0 (ListExtra.elemIndex targetId model.axisOrder)
                                        targetIndexWithout = Maybe.withDefault 0 (ListExtra.elemIndex targetId without)
                                        insertionIndex =
                                            if srcIndex < targetIndexOriginal then
                                                -- moving to the right: insert AFTER target
                                                targetIndexWithout + 1
                                            else
                                                -- moving to the left: insert BEFORE target
                                                targetIndexWithout
                                        ( before, after ) = ListExtra.splitAt insertionIndex without
                                    in
                                    before ++ (src :: after)
            in
            ( recomputePcModel { model | axisOrder = newOrder, draggingAxis = Nothing, dropTargetAxis = Nothing }, Cmd.none )
        ToggleRanking on ->
            ( recomputePcModel { model | ranking = on }, Cmd.none )
        TogglePcMode on ->
            ( recomputePcModel { model | useRelative = on }, Cmd.none )
        TogglePcDebug on ->
            ( { model | showPcDebug = on }, Cmd.none )
        SetPcHover name ->
            ( { model | pcHover = name }, Cmd.none )
        OnHoverHeatMap value ->
            let
                state = model.heatmapmodel
                newHeatMapModel = ( { state | selected = Just value })
            in
            ( { model | heatmapmodel = newHeatMapModel }, Cmd.none )
        OnLeaveHeatMap ->
             let
                state = model.heatmapmodel
                newHeatMapModel = ( { state | selected = Nothing })
            in
            ( { model | heatmapmodel = newHeatMapModel }, Cmd.none )


httpErrorToString : Http.Error -> String
httpErrorToString err =
    case err of
        Http.BadUrl u -> "BadUrl: " ++ u
        Http.Timeout -> "Timeout"
        Http.NetworkError -> "NetworkError"
        Http.BadStatus s -> "BadStatus: " ++ String.fromInt s
        Http.BadBody msg -> "BadBody: " ++ msg
