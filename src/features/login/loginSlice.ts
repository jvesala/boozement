import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'login',
    initialState: {
        username: undefined
    },
    reducers: {
        loginUser: (state, action) => {
            state.username = action.payload;
        }
    }
});

export const { loginUser } = slice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectUser = (state: any) => state.counter.username;

export default slice.reducer;
