import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'password',
    initialState: {
        showBusy: false
    },
    reducers: {
        setShowPasswordBusy: (state, action) => {
            state.showBusy = action.payload;
        }
    }
});

export const { setShowPasswordBusy } = slice.actions;

export const selectShowPasswordBusy = (state: any) => state.password.showBusy;

export default slice.reducer;
