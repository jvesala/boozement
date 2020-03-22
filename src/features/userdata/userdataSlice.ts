import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'userdata',
    initialState: {
        weight: ''
    },
    reducers: {
        updateWeight: (state, action) => {
            state.weight = action.payload;
        }
    }
});

export const { updateWeight } = slice.actions;

export const selectWeight = (state: any) => state.userdata.weight;

export default slice.reducer;
