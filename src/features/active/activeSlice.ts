import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'active',
    initialState: {
        activeUnits: '',
        activeBac: ''
    },
    reducers: {
        updateActiveUnits: (state, action) => {
            state.activeUnits = action.payload;
        },
        updateActiveBac: (state, action) => {
            state.activeBac = action.payload;
        }
    }
});

export const { updateActiveUnits, updateActiveBac } = slice.actions;

export const selectActiveUnits = (state: any) => state.active.activeUnits;
export const selectActiveBac = (state: any) => state.active.activeBac;

export default slice.reducer;
