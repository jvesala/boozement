import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest, doPutRequest } from '../../app/network';
import { weightInKilos } from '../../server/calculator';

export const slice = createSlice({
    name: 'userdata',
    initialState: {
        weight: '',
        gender: '',
        showBusy: false
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
        }
    }
});

export const {
    updateWeight,
    updateGender,
    setShowUserdataBusy
} = slice.actions;

export const userDataAsync = () => async (dispatch: any) => {
    const url = '/userdata';
    dispatch(setShowUserdataBusy(true));
    const body = await doGetRequest(url, {});
    dispatch(setShowUserdataBusy(false));
    dispatch(updateWeight(weightInKilos(body.weight)));
    dispatch(updateGender(body.gender));
};

export const updateUserdataAsync = (payload: any) => async (dispatch: any) => {
    const url = '/userdata';
    const body = await doPutRequest(url, payload);
    dispatch(setShowUserdataBusy(false));
    dispatch(updateWeight(weightInKilos(body.weight)));
};

export const selectWeight = (state: any) => state.userdata.weight;
export const selectGender = (state: any) => state.userdata.gender;
export const selectShowUserdataBusy = (state: any) => state.userdata.showBusy;

export default slice.reducer;
