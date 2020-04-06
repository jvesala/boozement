import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest } from '../../app/network';
import { Serving } from '../../server/database';
import { DateTime } from 'luxon';

export const slice = createSlice({
    name: 'history',
    initialState: {
        search: '',
        showBusy: true,
        historyServings: [],
        offset: 0,
        limit: 100
    },
    reducers: {
        updateHistorySearch: (state, action) => {
            state.search = action.payload;
        },
        setShowHistoryBusy: (state, action) => {
            state.showBusy = action.payload;
        },
        setHistoryServings: (state, action) => {
            state.historyServings = action.payload;
        },
        increaseScrollOffset: (state, action) => {
            state.offset = state.offset + action.payload;
        },
        appendHistoryServings: (state, action) => {
            state.historyServings = [].concat(
                ...state.historyServings,
                ...action.payload
            );
        }
    }
});

export const {
    updateHistorySearch,
    setShowHistoryBusy,
    setHistoryServings,
    increaseScrollOffset,
    appendHistoryServings
} = slice.actions;

export const parseServing = (serving: any) => {
    return {
        id: serving.id,
        date: DateTime.fromISO(serving.date),
        userId: serving.userId,
        type: serving.type,
        amount: serving.amount,
        units: serving.units
    };
};

export const historyServingsAsync = (
    search: any,
    offset: number,
    limit: number
) => async (dispatch: any) => {
    const url = '/servings';
    const query = `search=${search}&offset=${offset}&limit=${limit}`;

    dispatch(updateHistorySearch(search));
    dispatch(setShowHistoryBusy(true));
    const body = await doGetRequest(url, query);
    const json: Serving[] = body.map(parseServing);
    dispatch(setShowHistoryBusy(false));

    if (offset === 0) {
        dispatch(setHistoryServings(json));
    } else {
        dispatch(appendHistoryServings(json));
    }
};

export const selectHistorySearch = (state: any) => state.history.search;
export const selectHistoryShowBusy = (state: any) => state.history.showBusy;
export const selectHistoryServings = (state: any) =>
    state.history.historyServings;
export const selectHistoryOffset = (state: any) => state.history.offset;
export const selectHistoryLimit = (state: any) => state.history.limit;

export default slice.reducer;
