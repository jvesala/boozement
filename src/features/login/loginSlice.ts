import { createSlice } from '@reduxjs/toolkit';
import { Language } from '../../app/localization';
import Cookies from 'js-cookie';

const superagent = require('superagent');

export const slice = createSlice({
    name: 'login',
    initialState: {
        language: 'fi' as Language,
        showLoggedOut: false,
        showLoginError: false,
        username: Cookies.get('boozement-username')
    },
    reducers: {
        loginUser: (state, action) => {
            state.username = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        }
    }
});

export const { loginUser, setLanguage } = slice.actions;

export const doPostRequest = async (url: string, payload: any) => {
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

export const logoutUserAsync = () => async (dispatch: any) => {
    const url = '/logout';
    await doPostRequest(url, {});
    dispatch(loginUser(undefined));
};

export const selectLanguage = (state: any) => state.login.language;
export const selectShowLoggedOut = (state: any) => state.login.showLoggedOut;
export const selectUser = (state: any) => state.login.username;

export default slice.reducer;
