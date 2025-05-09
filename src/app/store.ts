import { configureStore } from '@reduxjs/toolkit';
import loginSlice from '../features/login/loginSlice';
import activeSlice from '../features/active/activeSlice';
import historySlice from '../features/history/historySlice';
import userdataSlice from '../features/userdata/userdataSlice';

import { combineSlices } from '@reduxjs/toolkit';

const rootReducer = combineSlices(
  loginSlice,
  activeSlice,
  historySlice,
  userdataSlice,
);
export type RootState = ReturnType<typeof rootReducer>;

export const configureStoreWithState = (preloadedState: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });
