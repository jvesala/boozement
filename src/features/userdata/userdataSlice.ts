import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest, doPutRequest } from '../../app/network';
import { weightInKilos } from '../../server/calculator';
import { UpdateUserData } from '../../server/domain';

export const slice = createSlice({
    name: 'userdata',
    initialState: {
        weight: '',
        gender: '',
        showError: false,
        showBusy: false,
        result: undefined,
    },
    reducers: {
        updateWeight: (state, action) => {
            state.weight = action.payload;
        },
        updateGender: (state, action) => {
            state.gender = action.payload;
        },
        setShowUserdataBusy: (state, action) => {
            state.showBusy = action.payload;
        },
        setUserdataResult: (state, action) => {
            state.result = action.payload;
        },
        setShowUserdataError: (state, action) => {
            state.showError = action.payload;
        },
    },
});

export const {
    updateWeight,
    updateGender,
    setShowUserdataBusy,
    setUserdataResult,
    setShowUserdataError,
} = slice.actions;

export const userDataAsync = () => async (dispatch: any) => {
    const url = '/api/userdata';
    dispatch(setShowUserdataBusy(true));
    const body = await doGetRequest(url, {});
    dispatch(setShowUserdataBusy(false));
    dispatch(updateWeight(weightInKilos(body.weight)));
    dispatch(updateGender(body.gender));
};

export const updateUserdataAsync = (payload: UpdateUserData) => async (dispatch: any) => {
    const url = '/api/userdata';
    await doPutRequest(url, payload);
    dispatch(setShowUserdataBusy(false));
    dispatch(setUserdataResult(true));
    dispatch(setShowUserdataError(false));
};

export const selectWeight = (state: any) => state.userdata.weight;
export const selectGender = (state: any) => state.userdata.gender;
export const selectShowUserdataBusy = (state: any) => state.userdata.showBusy;
export const selectUserdataError = (state: any) => state.userdata.showError;
export const selectUserdataResult = (state: any) => state.userdata.result;

export default slice.reducer;
