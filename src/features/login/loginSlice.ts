import { createSlice } from '@reduxjs/toolkit';
import { Language } from '../../app/localization';

const superagent = require('superagent');

export const slice = createSlice({
    name: 'login',
    initialState: {
        language: 'fi' as Language,
        showLoggedOut: false,
        showLoginError: false,
        username: undefined
    },
    reducers: {
        loginUser: (state, action) => {
            state.username = action.payload;
        }
    }
});

export const { loginUser } = slice.actions;

export const doPostRequest = async (
    url: string,
    payload: { password: string; email: string }
) => {
    const contentType = 'application/json;charset=utf-8';
    const response = await superagent
        .post(url)
        .type(contentType)
        .send(payload)
        .timeout(60000);
    return response.body;
};

export const loginUserAsync = (email: string, password: string) => async (
    dispatch: any
) => {
    const payload = {
        email,
        password
    };
    const url = '/login';
    const body = await doPostRequest(url, payload);
    dispatch(loginUser(body.email));
};

//export const loginUserAsync = amount => dispatch => {
//    setTimeout(() => {
//        dispatch(loginUser(amount));
//    }, 1000);
//};
//

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectLanguage = (state: any) => state.login.language;
export const selectShowLoggedOut = (state: any) => state.login.showLoggedOut;
export const selectUser = (state: any) => state.login.username;

export default slice.reducer;
