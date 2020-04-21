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
        username: Cookies.get('boozement-username')
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
        }
    }
});

export const {
    loginUser,
    setShowLoginBusy,
    setShowLoginError,
    setShowLoggedOut,
    setLanguage
} = slice.actions;

export const loginUserAsync = (email: string, password: string) => async (
    dispatch: any
) => {
    const payload = {
        email,
        password
    };
    const url = '/login';
    try {
        dispatch(setShowLoginBusy(true));
        const body = await doPostRequest(url, payload);
        dispatch(setShowLoginBusy(false));
        dispatch(setShowLoginError(false));
        dispatch(loginUser(body.email));
    } catch (e) {
        dispatch(setShowLoginBusy(false));
        dispatch(setShowLoginError(true));
    }
};

export const logoutUserAsync = () => async (dispatch: any) => {
    const url = '/logout';
    await doPostRequest(url, {});
    dispatch(loginUser(undefined));
    dispatch(setShowLoggedOut(true));
};

export const selectLanguage = (state: any) => state.login.language;
export const selectUsername = (state: any) => state.login.username;
export const selectShowLoggedOut = (state: any) => state.login.showLoggedOut;
export const selectShowLoginError = (state: any) => state.login.showLoginError;
export const selectShowLoginBusy = (state: any) => state.login.showBusy;
export const selectUser = (state: any) => state.login.username;

export default slice.reducer;
