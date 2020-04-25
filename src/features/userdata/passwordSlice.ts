import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'password',
    initialState: {
        showError: false,
        showBusy: false,
        result: undefined
    },
    reducers: {
        setShowPasswordBusy: (state, action) => {
            state.showBusy = action.payload;
        },
        setPasswordResult: (state, action) => {
            state.result = action.payload;
        },
        setShowPasswordError: (state, action) => {
            state.showError = action.payload;
        }
    }
});

export const {
    setShowPasswordBusy,
    setPasswordResult,
    setShowPasswordError
} = slice.actions;

export const selectShowPasswordBusy = (state: any) => state.password.showBusy;
export const selectPasswordResult = (state: any) => state.password.result;
export const selectShowPasswordError = (state: any) => state.password.showError;

export default slice.reducer;
