import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest } from '../../app/network';

export const slice = createSlice({
    name: 'history',
    initialState: {
        search: '',
        showBusy: true,
        historyServings: [],
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
            state.historyServings = action.payload;
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
                ...action.payload
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
    appendHistoryServings
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

export const selectHistorySearch = (state: any) => state.history.search;
export const selectHistoryShowBusy = (state: any) => state.history.showBusy;
export const selectHistoryServings = (state: any) =>
    state.history.historyServings;
export const selectHistoryEditServing = (state: any) =>
    state.history.editServing;
export const selectHistoryOffset = (state: any) => state.history.offset;
export const selectHistoryLimit = (state: any) => state.history.limit;

export default slice.reducer;
