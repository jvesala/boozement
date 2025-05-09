import { createSlice } from '@reduxjs/toolkit';
import {
  doGetRequest,
  doPutRequest,
  forwardLoginIfUnauthorized,
} from '../../app/network';
import { updateServingInServingsArrays } from '../history/historySlice';
import {
  type RecentServingsResponse,
  Serving,
  UpdateServing,
} from '../../server/domain';

export type ActiveState = {
  activeBac: string;
  showBusy: boolean;
  activeServings: any[];
  totalCount: number;
  totalUnits: number;
  editServing?: EditServing;
};

export type EditServing = {
  id: number;
  field: string;
};

const initialState: ActiveState = {
  activeBac: '',
  showBusy: true,
  activeServings: [],
  totalCount: 0,
  totalUnits: 0,
};

export const slice = createSlice({
  name: 'active',
  initialState,
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
        state.activeServings,
        action.payload,
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
  const successHandler = (success: RecentServingsResponse) => {
    dispatch(setShowActiveBusy(false));
    dispatch(setActiveServings(success.servings));
    dispatch(updateActiveBac(success.bac));
  };
  const errorHandler = (err: Error) => {
    forwardLoginIfUnauthorized(dispatch, err);
    console.error(err);
  };
  await doGetRequest(url, query, successHandler, errorHandler);
};

export const activeUpdateAsync =
  (payload: UpdateServing) => async (dispatch: any) => {
    const url = '/api/insert';
    dispatch(setShowActiveBusy(true));
    const successHandler = (success: Serving) => {
      dispatch(setShowActiveBusy(false));
      dispatch(updateActiveServing(success));
    };
    const errorHandler = (err: Error) => {
      forwardLoginIfUnauthorized(dispatch, err);
      console.error(err);
    };
    await doPutRequest(url, payload, successHandler, errorHandler);
  };

export const selectActiveBac = (state: any) => state.active.activeBac;
export const selectActiveShowBusy = (state: any) => state.active.showBusy;
export const selectActiveServings = (state: any) => state.active.activeServings;
export const selectActiveTotalCount = (state: any) => state.active.totalCount;
export const selectActiveTotalUnits = (state: any) => state.active.totalUnits;
export const selectActiveEditServing = (state: any) => state.active.editServing;

export default slice;
