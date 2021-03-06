import { createSlice, nanoid, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

// Redux Toolkit's createAsyncThunk API generates thunks that
// automatically dispatch those "start/success/failure" actions for you.
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts'); // 'posts/fetchPosts' as the action type prefix
    return response.posts;
    // Our payload creation callback waits for the API call to return a response
})
// The thunks generated by createAsyncThunk will always return a resolved promise with either the fulfilled action object or rejected action object inside, as appropriate.

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
        // We send the initial data to the fake API server
        const response = await client.post('/fakeApi/posts', { post: initialPost })
        // The response includes the complete post object, including unique ID
        return response.post
    }
)

// ! Managing Normalized State with createEntityAdapter
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

// comment this
// const initialState = {
//     posts: [],
//     status: 'idle',
//     error: null
// }

// use this
const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId,
                        reactions: {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0,
                        },
                    }
                }
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload;
            // const existingPost = state.posts.find(post => post.id === id);

            // ! Managing Normalized State with createEntityAdapter
            const existingPost = state.entities[id];
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            // const existingPost = state.posts.find(post => post.id === postId);

            // ! Managing Normalized State with createEntityAdapter
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers: {
        [fetchPosts.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.status = 'succeeded'

            // Add any fetched posts to the array
            // state.posts = state.posts.concat(action.payload)

            // ! Managing Normalized State with createEntityAdapter
            // Use the `upsertMany` reducer as a mutating update utility
            postsAdapter.upsertMany(state, action.payload);
        },
        [fetchPosts.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        // [addNewPost.fulfilled]: (state, action) => {
        //     // We can directly add the new post object to our posts array
        //     state.posts.push(action.payload)
        // },
        // ! Managing Normalized State with createEntityAdapter
        [addNewPost.fulfilled]: postsAdapter.addOne
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

// export const selectAllPosts = (state) => state.posts.posts;

// export const selectPostById = (state, postId) => {
//     return state.posts.posts.find((post) => post.id === postId)
// }

// ! Improving Render Performance
// Export the customized selectors for this adapter using `getSelectors`
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
);