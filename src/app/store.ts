import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/login/loginSlice';
import activeReducer from '../features/active/activeSlice';
import historyReducer from '../features/history/historySlice';
import userdataSlice from '../features/userdata/userdataSlice';

export const configureStoreWithState = (preloadedState: any) => configureStore({
    reducer: {
        login: loginReducer,
        active: activeReducer,
        history: historyReducer,
        userdata: userdataSlice,
    },
    preloadedState
});
