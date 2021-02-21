import {authAPI, MeResponseType} from "../api/todolists-api";
import {call, put} from "redux-saga/effects";
import {initializeAppWorckerSaga} from "./app-sagas";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {setAppInitializedAC} from "./app-reducer";


let meResponse: MeResponseType

beforeEach(() => {
    meResponse = {
        resultCode: 0,
        data: {
            login: "",
            email: "",
            id: 3
        },
        messages: []
    }
})


test('initializeAppWorckerSaga login success', () => {
    const gen = initializeAppWorckerSaga();
    expect(gen.next().value).toEqual(call(authAPI.me))
    expect(gen.next(meResponse).value).toEqual(put(setIsLoggedInAC(true)))
    expect(gen.next().value).toEqual(put(setAppInitializedAC(true)))
})


test('initializeAppWorckerSaga login unsuccess', () => {
    const gen = initializeAppWorckerSaga();
    expect(gen.next().value).toEqual(call(authAPI.me))

    meResponse.resultCode = 1;
    expect(gen.next(meResponse).value).toEqual(put(setAppInitializedAC(true)))
})