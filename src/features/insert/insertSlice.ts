import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

const now = DateTime.local();

export const slice = createSlice({
    name: 'insert',
    initialState: {
        date: now.toISODate(),
        time: now.hour + ':' + now.minute,
        type: '',
        amount: '',
        units: ''
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
        }
    }
});

export const {
    updateDate,
    updateTime,
    updateType,
    updateAmount,
    updateUnits
} = slice.actions;

export const selectDate = (state: any) => state.insert.date;
export const selectTime = (state: any) => state.insert.time;
export const selectType = (state: any) => state.insert.type;
export const selectAmount = (state: any) => state.insert.amount;
export const selectUnits = (state: any) => state.insert.units;

export default slice.reducer;
