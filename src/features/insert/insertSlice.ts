import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { doPostRequest } from '../../app/network';

const now = DateTime.local();

export const slice = createSlice({
    name: 'insert',
    initialState: {
        date: now.toISODate(),
        time: now.hour + ':' + now.minute,
        type: '',
        amount: '',
        units: '',
        showError: false,
        showBusy: false,
        result: undefined
    },
    reducers: {
        updateDate: (state, action) => {
            state.date = action.payload;
        },
        updateTime: (state, action) => {
            state.time = action.payload;
        },
        updateType: (state, action) => {
            state.type = action.payload;
        },
        updateAmount: (state, action) => {
            state.amount = action.payload;
        },
        updateUnits: (state, action) => {
            state.units = action.payload;
        },
        setShowInsertBusy: (state, action) => {
            state.showBusy = action.payload;
        },
        insertSuccess: (state, action) => {
            state.amount = '';
            state.units = '';
            state.result = action.payload;
        }
    }
});

export const {
    updateDate,
    updateTime,
    updateType,
    updateAmount,
    updateUnits,
    setShowInsertBusy,
    insertSuccess
} = slice.actions;

export const insertAsync = (payload: any) => async (dispatch: any) => {
    const url = '/insert';
    const body = await doPostRequest(url, payload);
    dispatch(setShowInsertBusy(false));
    dispatch(insertSuccess(body));
};

export const selectDate = (state: any) => state.insert.date;
export const selectTime = (state: any) => state.insert.time;
export const selectType = (state: any) => state.insert.type;
export const selectAmount = (state: any) => state.insert.amount;
export const selectUnits = (state: any) => state.insert.units;
export const selectShowInsertBusy = (state: any) => state.insert.showBusy;
export const selectShowInsertError = (state: any) => state.insert.showError;
export const selectInsertResult = (state: any) => state.insert.result;

export default slice.reducer;
