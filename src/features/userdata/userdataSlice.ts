import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest } from '../../app/network';
import { weightInKilos } from '../../server/calculator';

export const slice = createSlice({
    name: 'userdata',
    initialState: {
        weight: '',
        gender: '',
    },
    reducers: {
        updateWeight: (state, action) => {
            state.weight = action.payload;
        },
        updateGender: (state, action) => {
            state.gender = action.payload;
        },
    },
});

export const { updateWeight, updateGender } = slice.actions;

export const userDataAsync = () => async (dispatch: any) => {
    const url = '/api/userdata';
    const successHandler = (success: any) => {
        dispatch(updateWeight(weightInKilos(success.body.weight)));
        dispatch(updateGender(success.body.gender));
    };
    const errorHandler = (err: any) => {
        console.error(err);
    };
    await doGetRequest(url, {}, successHandler, errorHandler);
};

export const selectWeight = (state: any) => state.userdata.weight;
export const selectGender = (state: any) => state.userdata.gender;

export default slice.reducer;
