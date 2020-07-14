import { createSlice } from '@reduxjs/toolkit';
import { Language } from '../../app/localization';
import { doPostRequest, forwardLoginIfUnauthorized } from '../../app/network';
import { User } from '../../server/domain';

export const slice = createSlice({
    name: 'login',
    initialState: {
        language: 'fi' as Language,
        showLoggedOut: false,
        username: undefined,
    },
    reducers: {
        loginUser: (state, action) => {
            state.username = action.payload;
        },
        setShowLoggedOut: (state, action) => {
            state.showLoggedOut = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});

export const { loginUser, setShowLoggedOut, setLanguage } = slice.actions;

export const logoutUserAsync = () => async (dispatch: any) => {
    const url = '/api/logout';
    const successHandler = (_: User) => {
        dispatch(loginUser(undefined));
        dispatch(setShowLoggedOut(true));
    };
    const errorHandler = (err: Error) => {
        forwardLoginIfUnauthorized(dispatch, err);
        console.error(err);
    };
    await doPostRequest(url, {}, successHandler, errorHandler);
};

export const selectLanguage = (state: any) => state.login.language;
export const selectUsername = (state: any) => state.login.username;
export const selectShowLoggedOut = (state: any) => state.login.showLoggedOut;
export const selectUser = (state: any) => state.login.username;

export default slice.reducer;
