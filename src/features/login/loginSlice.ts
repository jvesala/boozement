import { createSlice } from '@reduxjs/toolkit';
import type { Language } from '../../app/localization';
import { doPostRequest, forwardLoginIfUnauthorized } from '../../app/network';

export type LoginState = {
  language: Language;
  showLoggedOut: boolean;
  username: string | undefined;
};

const initialState: LoginState = {
  language: 'fi',
  showLoggedOut: false,
  username: undefined,
};

export const slice = createSlice({
  name: 'login',
  initialState,
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
  const successHandler = () => {
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
export const selectShowLoggedOut = (state: any) => state.login.showLoggedOut;
export const selectUser = (state: any) => state.login.username;

export default slice;
