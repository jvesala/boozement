import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest } from '../../app/network';
import { DateTime } from 'luxon';
import { Serving } from '../../server/database';

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

export const activeServingsAsync = (query: any) => async (dispatch: any) => {
    const url = '/servings';
    dispatch(setShowActiveBusy(true));
    const body = await doGetRequest(url, query);
    const json: Serving[] = body.map((serving: any) => {
        return {
            id: serving.id,
            date: DateTime.fromISO(serving.date),
            userId: serving.userId,
            type: serving.type,
            amount: serving.amount,
            units: serving.units
        };
    });
    dispatch(setShowActiveBusy(false));
    dispatch(setActiveServings(json));
};

export const selectActiveUnits = (state: any) => state.active.activeUnits;
export const selectActiveBac = (state: any) => state.active.activeBac;
export const selectActiveShowBusy = (state: any) => state.active.showBusy;
export const selectActiveServings = (state: any) => state.active.activeServings;

export default slice.reducer;
