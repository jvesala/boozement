import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'history',
    initialState: {
        search: ''
    },
    reducers: {
        updateSearch: (state, action) => {
            state.search = action.payload;
        }
    }
});

export const { updateSearch } = slice.actions;

export const selectSearch = (state: any) => state.history.search;

export default slice.reducer;
