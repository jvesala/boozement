import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

export const slice = createSlice({
    name: 'insert',
    initialState: {
        date: DateTime.utc().toISODate(),
        type: ''
    },
    reducers: {
        updateDate: (state, action) => {
            state.date = action.payload;
        },
        updateType: (state, action) => {
            state.type = action.payload;
        }
    }
});

export const { updateDate, updateType } = slice.actions;

export const selectDate = (state: any) => state.insert.date;
export const selectType = (state: any) => state.insert.type;

export default slice.reducer;
