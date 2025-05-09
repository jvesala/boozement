import { createSlice } from '@reduxjs/toolkit';
import { doGetRequest, forwardLoginIfUnauthorized } from '../../app/network';
import { weightInKilos } from '../../server/calculator';
import { UserDataResponse } from '../../server/domain';

export type UserdataState = {
  weight: string;
  gender: string;
};

const initialState: UserdataState = {
  weight: '',
  gender: '',
};

export const slice = createSlice({
  name: 'userdata',
  initialState,
  reducers: {
    updateWeight: (state, action) => {
      state.weight = action.payload;
    },
    updateGender: (state, action) => {
      state.gender = action.payload;
    },
  },
});

export const { updateWeight, updateGender } = slice.actions;

export const userDataAsync = () => async (dispatch: any) => {
  const url = '/api/userdata';
  const successHandler = (success: UserDataResponse) => {
    dispatch(updateWeight(weightInKilos(success.weight)));
    dispatch(updateGender(success.gender));
  };
  const errorHandler = (err: Error) => {
    forwardLoginIfUnauthorized(dispatch, err);
    console.error(err);
  };
  await doGetRequest(url, {}, successHandler, errorHandler);
};

export const selectWeight = (state: any) => state.userdata.weight;
export const selectGender = (state: any) => state.userdata.gender;

export default slice.reducer;
