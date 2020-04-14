import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest, doPutRequest } from '../../app/network';

export const slice = createSlice({
    name: 'history',
    initialState: {
        search: '',
        showBusy: true,
        historyServings: [],
        totalCount: 0,
        totalUnits: 0,
        editServing: undefined,
        offset: 0,
        limit: 100
    },
    reducers: {
        updateHistorySearch: (state, action) => {
            state.offset = 0;
            state.search = action.payload;
        },
        setShowHistoryBusy: (state, action) => {
            state.showBusy = action.payload;
        },
        setHistoryServings: (state, action) => {
            state.historyServings = action.payload.servings;
            state.totalCount = action.payload.totalCount;
            state.totalUnits = action.payload.totalUnits;
        },
        setHistoryEditServing: (state, action) => {
            state.editServing = action.payload;
        },
        setServingsOffset: (state, action) => {
            state.offset = action.payload;
        },
        appendHistoryServings: (state, action) => {
            state.historyServings = [].concat(
                ...state.historyServings,
                ...action.payload.servings
            );
        },
        updateHistoryServing: (state, action) => {
            state.historyServings = updateServingInServingsArrays(
                state.historyServings as any,
                action.payload[0]
            );
        }
    }
});

export const {
    updateHistorySearch,
    setShowHistoryBusy,
    setHistoryServings,
    setHistoryEditServing,
    setServingsOffset,
    appendHistoryServings,
    updateHistoryServing
} = slice.actions;

export const historyServingsAsync = (
    search: any,
    offset: number,
    limit: number
) => async (dispatch: any) => {
    const url = '/servings';
    const query = `search=${search}&offset=${offset}&limit=${limit}`;

    dispatch(setShowHistoryBusy(true));
    const body = await doGetRequest(url, query);
    dispatch(setShowHistoryBusy(false));

    if (offset === 0) {
        dispatch(setHistoryServings(body));
    } else {
        dispatch(appendHistoryServings(body));
    }
};

export const historyUpdateAsync = (payload: any) => async (dispatch: any) => {
    const url = '/insert';
    dispatch(setShowHistoryBusy(true));
    const body = await doPutRequest(url, payload);
    dispatch(setShowHistoryBusy(false));
    dispatch(updateHistoryServing(body));
};

export const selectHistorySearch = (state: any) => state.history.search;
export const selectHistoryShowBusy = (state: any) => state.history.showBusy;
export const selectHistoryServings = (state: any) =>
    state.history.historyServings;
export const selectHistoryTotalCount = (state: any) => state.history.totalCount;
export const selectHistoryTotalUnits = (state: any) => state.history.totalUnits;
export const selectHistoryEditServing = (state: any) =>
    state.history.editServing;
export const selectHistoryOffset = (state: any) => state.history.offset;
export const selectHistoryLimit = (state: any) => state.history.limit;

export default slice.reducer;

export const updateServingInServingsArrays = (servings: [], updated: any) =>
    servings.map(serving => {
        if ((serving as any).id === updated.id) {
            (serving as any).date = updated.date;
            (serving as any).type = updated.type;
            (serving as any).amount = updated.amount;
            (serving as any).units = updated.units;
            return serving;
        } else {
            return serving;
        }
    });
