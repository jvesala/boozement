import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest, doPutRequest } from '../../app/network';
import { updateServingInServingsArrays } from '../history/historySlice';
import { UpdateServing } from '../../server/domain';

export const slice = createSlice({
    name: 'active',
    initialState: {
        activeBac: '',
        showBusy: true,
        activeServings: [],
        totalCount: 0,
        totalUnits: 0,
        editServing: undefined,
    },
    reducers: {
        updateActiveBac: (state, action) => {
            state.activeBac = action.payload;
        },
        setShowActiveBusy: (state, action) => {
            state.showBusy = action.payload;
        },
        setActiveServings: (state, action) => {
            state.activeServings = action.payload.servings;
            state.totalCount = action.payload.totalCount;
            state.totalUnits = action.payload.totalUnits;
        },
        setActiveEditServing: (state, action) => {
            state.editServing = action.payload;
        },
        updateActiveServing: (state, action) => {
            state.activeServings = updateServingInServingsArrays(
                state.activeServings as any,
                action.payload[0]
            );
        },
    },
});

export const {
    updateActiveBac,
    setShowActiveBusy,
    setActiveServings,
    setActiveEditServing,
    updateActiveServing,
} = slice.actions;

export const activeServingsAsync = (hours: any) => async (dispatch: any) => {
    const url = '/api/recentServings';
    const query = `hours=${hours}`;
    dispatch(setShowActiveBusy(true));
    const body = await doGetRequest(url, query);
    dispatch(setShowActiveBusy(false));
    dispatch(setActiveServings(body.servings));
    dispatch(updateActiveBac(body.bac));
};

export const activeUpdateAsync = (payload: UpdateServing) => async (dispatch: any) => {
    const url = '/api/insert';
    dispatch(setShowActiveBusy(true));
    const body = await doPutRequest(url, payload);
    dispatch(setShowActiveBusy(false));
    dispatch(updateActiveServing(body));
};

export const selectActiveBac = (state: any) => state.active.activeBac;
export const selectActiveShowBusy = (state: any) => state.active.showBusy;
export const selectActiveServings = (state: any) => state.active.activeServings;
export const selectActiveTotalCount = (state: any) => state.active.totalCount;
export const selectActiveTotalUnits = (state: any) => state.active.totalUnits;
export const selectActiveEditServing = (state: any) => state.active.editServing;

export default slice.reducer;
