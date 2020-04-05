import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest } from '../../app/network';
import { Serving } from '../../server/database';
import { DateTime } from 'luxon';

export const slice = createSlice({
    name: 'history',
    initialState: {
        search: '',
        showBusy: true,
        historyServings: []
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
        }
    }
});

export const {
    updateHistorySearch,
    setShowHistoryBusy,
    setHistoryServings
} = slice.actions;

export const historyServingsAsync = (query: any) => async (dispatch: any) => {
    const url = '/servings';
    dispatch(updateHistorySearch(query));
    dispatch(setShowHistoryBusy(true));
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
    dispatch(setShowHistoryBusy(false));
    dispatch(setHistoryServings(json));
};

export const selectHistorySearch = (state: any) => state.history.search;
export const selectHistoryShowBusy = (state: any) => state.history.showBusy;
export const selectHistoryServings = (state: any) =>
    state.history.historyServings;

export default slice.reducer;
