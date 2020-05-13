import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { doGetRequest, doPostRequest } from '../../app/network';

const now = DateTime.local();

export const slice = createSlice({
    name: 'insert',
    initialState: {
        date: now.toISODate(),
        time:
            String(now.hour).padStart(2, '0') +
            ':' +
            String(now.minute).padStart(2, '0'),
        type: '',
        suggestions: [],
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
        updateSuggestions: (state, action) => {
            state.suggestions = action.payload;
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
    updateSuggestions,
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

export const suggestionsAsync = (payload: any) => async (dispatch: any) => {
    const url = '/suggestions';
    const body = await doGetRequest(url, payload);
    dispatch(updateSuggestions(body));
};

export const selectDate = (state: any) => state.insert.date;
export const selectTime = (state: any) => state.insert.time;
export const selectType = (state: any) => state.insert.type;
export const selectSuggestions = (state: any) => state.insert.suggestions;
export const selectAmount = (state: any) => state.insert.amount;
export const selectUnits = (state: any) => state.insert.units;
export const selectShowInsertBusy = (state: any) => state.insert.showBusy;
export const selectShowInsertError = (state: any) => state.insert.showError;
export const selectInsertResult = (state: any) => state.insert.result;

export default slice.reducer;
