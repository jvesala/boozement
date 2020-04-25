import { createSlice } from '@reduxjs/toolkit';
import { doPutRequest } from '../../app/network';

export const slice = createSlice({
    name: 'password',
    initialState: {
        currentPassword: '',
        newPassword: '',
        copyPassword: '',
        showError: false,
        showBusy: false,
        result: undefined
    },
    reducers: {
        setCurrentPassword: (state, action) => {
            state.currentPassword = action.payload;
        },
        setNewPassword: (state, action) => {
            state.newPassword = action.payload;
        },
        setCopyPassword: (state, action) => {
            state.copyPassword = action.payload;
        },
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
    setCurrentPassword,
    setNewPassword,
    setCopyPassword,
    setShowPasswordBusy,
    setPasswordResult,
    setShowPasswordError
} = slice.actions;

export const updatePasswordAsync = (payload: any) => async (dispatch: any) => {
    const url = '/password';
    await doPutRequest(url, payload);
    dispatch(setShowPasswordBusy(false));
    dispatch(setPasswordResult(true));
};

export const selectCurrentPassword = (state: any) =>
    state.password.currentPassword;
export const selectNewPassword = (state: any) => state.password.newPassword;
export const selectCopyPassword = (state: any) => state.password.copyPassword;
export const selectShowPasswordBusy = (state: any) => state.password.showBusy;
export const selectPasswordResult = (state: any) => state.password.result;
export const selectShowPasswordError = (state: any) => state.password.showError;

export default slice.reducer;
