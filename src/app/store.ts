import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/login/loginSlice';

export default configureStore({
    reducer: {
        counter: counterReducer
    }
});
