import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest, doPutRequest } from '../../app/network';

export const slice = createSlice({
    name: 'active',
    initialState: {
        activeUnits: '',
        activeBac: '',
        showBusy: true,
        activeServings: [],
        editServing: undefined
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
        },
        setActiveEditServing: (state, action) => {
            state.editServing = action.payload;
        },
        updateActiveServing: (state, action) => {
            state.activeServings = state.activeServings.map(serving => {
                if ((serving as any).id === action.payload.id) {
                    (serving as any).date = action.payload.date;
                    (serving as any).type = action.payload.type;
                    (serving as any).amount = action.payload.amount;
                    (serving as any).units = action.payload.units;
                    return serving;
                } else {
                    return serving;
                }
            });
        }
    }
});

export const {
    updateActiveUnits,
    updateActiveBac,
    setShowActiveBusy,
    setActiveServings,
    setActiveEditServing,
    updateActiveServing
} = slice.actions;

export const activeServingsAsync = (hours: any) => async (dispatch: any) => {
    const url = '/recentServings';
    const query = `hours=${hours}`;
    dispatch(setShowActiveBusy(true));
    const body = await doGetRequest(url, query);
    dispatch(setShowActiveBusy(false));
    dispatch(setActiveServings(body));
};

export const activeUpdateAsync = (payload: any) => async (dispatch: any) => {
    const url = '/insert';
    dispatch(setShowActiveBusy(true));
    const body = await doPutRequest(url, payload);
    dispatch(setShowActiveBusy(false));
    dispatch(updateActiveServing(body));
};

export const selectActiveUnits = (state: any) => state.active.activeUnits;
export const selectActiveBac = (state: any) => state.active.activeBac;
export const selectActiveShowBusy = (state: any) => state.active.showBusy;
export const selectActiveServings = (state: any) => state.active.activeServings;
export const selectActiveEditServing = (state: any) => state.active.editServing;

export default slice.reducer;
