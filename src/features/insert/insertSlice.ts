import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

const now = DateTime.local();

export const slice = createSlice({
    name: 'insert',
    initialState: {
        date: now.toISODate(),
        time: now.hour + ':' + now.minute,
        type: ''
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
        }
    }
});

export const { updateDate, updateTime, updateType } = slice.actions;

export const selectDate = (state: any) => state.insert.date;
export const selectTime = (state: any) => state.insert.time;
export const selectType = (state: any) => state.insert.type;

export default slice.reducer;
