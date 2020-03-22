import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/login/loginSlice';
import insertReducer from '../features/insert/insertSlice';
import activeReducer from '../features/active/activeSlice';
import historyReducer from '../features/history/historySlice';
import userdataSlice from '../features/userdata/userdataSlice';

export default configureStore({
    reducer: {
        login: loginReducer,
        insert: insertReducer,
        active: activeReducer,
        history: historyReducer,
        userdata: userdataSlice
    }
});
