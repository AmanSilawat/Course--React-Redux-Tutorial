import { configureStore } from '@reduxjs/toolkit';

import postsReducer from '../features/posts/postsSlice';
import usersReducer from '../features/users/usersSlice';

const store = configureStore({
    reducer: {
        posts: postsReducer,
        users: usersReducer
    },
})

export default store;

// Thunk Functions
const exampleThunkFunction = (dispatch, getState) => {
    const stateBefore = getState()
    // console.log(stateBefore)
}

// it allows you to pass thunk functions directly to store.dispatch
store.dispatch(exampleThunkFunction)