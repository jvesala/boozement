import { createSlice } from '@reduxjs/toolkit';
import { Language } from '../../app/localization';
import Cookies from 'js-cookie';
import { doPostRequest } from '../../app/network';

export const slice = createSlice({
    name: 'login',
    initialState: {
        language: 'fi' as Language,
        showLoggedOut: false,
        showLoginError: false,
        showBusy: false,
        username: Cookies.get('boozement-username'),
    },
    reducers: {
        loginUser: (state, action) => {
            state.username = action.payload;
        },
        setShowLoginBusy: (state, action) => {
            state.showBusy = action.payload;
        },
        setShowLoginError: (state, action) => {
            state.showLoginError = action.payload;
        },
        setShowLoggedOut: (state, action) => {
            state.showLoggedOut = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});

export const {
    loginUser,
    setShowLoginBusy,
    setShowLoginError,
    setShowLoggedOut,
    setLanguage,
} = slice.actions;

export const loginUserAsync = (email: string, password: string) => async (
    dispatch: any
) => {
    const payload = {
        email,
        password,
    };
    const url = '/api/login';
    dispatch(setShowLoginBusy(true));
    const successHandler = (success: any) => {
        dispatch(setShowLoginBusy(false));
        dispatch(setShowLoginError(false));
        dispatch(loginUser(success.body.email));
    };
    const errorHandler = (err: any) => {
        console.error(err);
        dispatch(setShowLoginBusy(false));
        dispatch(setShowLoginError(true));
    };
    await doPostRequest(url, payload, successHandler, errorHandler);
};

export const logoutUserAsync = () => async (dispatch: any) => {
    const url = '/api/logout';
    const successHandler = (_: any) => {
        dispatch(loginUser(undefined));
        dispatch(setShowLoggedOut(true));
    };
    const errorHandler = (err: any) => {
        console.error(err);
    };
    await doPostRequest(url, {}, successHandler, errorHandler);
};

export const selectLanguage = (state: any) => state.login.language;
export const selectUsername = (state: any) => state.login.username;
export const selectShowLoggedOut = (state: any) => state.login.showLoggedOut;
export const selectShowLoginError = (state: any) => state.login.showLoginError;
export const selectShowLoginBusy = (state: any) => state.login.showBusy;
export const selectUser = (state: any) => state.login.username;

export default slice.reducer;
