import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest } from '../../app/network';

export const slice = createSlice({
    name: 'active',
    initialState: {
        activeUnits: '',
        activeBac: '',
        showBusy: true,
        activeServings: []
    },
    reducers: {
        updateActiveUnits: (state, action) => {
            state.activeUnits = action.payload;
        },
        updateActiveBac: (state, action) => {
            state.activeBac = action.payload;
        },
        setShowActiveBusy: (state, action) => {
            state.showBusy = action.payload;
        },
        setActiveServings: (state, action) => {
            state.activeServings = action.payload;
        }
    }
});

export const {
    updateActiveUnits,
    updateActiveBac,
    setShowActiveBusy,
    setActiveServings
} = slice.actions;

export const activeServingsAsync = (hours: any) => async (dispatch: any) => {
    const url = '/recentServings';
    const query = `hours=${hours}`;
    dispatch(setShowActiveBusy(true));
    const body = await doGetRequest(url, query);
    dispatch(setShowActiveBusy(false));
    dispatch(setActiveServings(body));
};

export const selectActiveUnits = (state: any) => state.active.activeUnits;
export const selectActiveBac = (state: any) => state.active.activeBac;
export const selectActiveShowBusy = (state: any) => state.active.showBusy;
export const selectActiveServings = (state: any) => state.active.activeServings;

export default slice.reducer;
