import { createSlice } from '@reduxjs/toolkit';
import { Language } from '../../app/localization';

export const slice = createSlice({
    name: 'login',
    initialState: {
        language: 'fi' as Language,
        showLoggedOut: false,
        username: undefined
    },
    reducers: {
        loginUser: (state, action) => {
            state.username = action.payload;
        }
    }
});

export const { loginUser } = slice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectLanguage = (state: any) => state.login.language;
export const selectShowLoggedOut = (state: any) => state.login.showLoggedOut;
export const selectUser = (state: any) => state.login.username;

export default slice.reducer;
