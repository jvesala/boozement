import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'active',
    initialState: {
        type: ''
    },
    reducers: {
        updateType: (state, action) => {
            state.type = action.payload;
        }
    }
});

export const { updateType } = slice.actions;

export const selectType = (state: any) => state.insert.type;

export default slice.reducer;
