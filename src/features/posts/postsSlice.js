import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://73b2e477-a28f-4970-8116-232a588b3002-00-3gw52rtdl66kv.pike.replit.dev";

// Async thunk for fetching a user's posts. If we want to use redux, all API call should be in async thunk, not in other pages.
export const fetchPostsByUser = createAsyncThunk(   // async thunk method is used to handle asynchronous operation. Instead of making entire website loading, we can use this to make only specific part in the website loading.
    "posts/fetchByUser",    // this name does not affect the function. It is a good practice to put it same as variable name 
    async (userId) => {
        const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
        return response.json();
    }
);

export const savePost = createAsyncThunk(
    "post/savePost",
    async (postContent) => {
        const token = localStorage.getItem("authToken");
        const decode = jwtDecode(token);
        // const tokenData = jwtDecode(localStorage.getItem("authToken"));      // 2nd option: combine token & decode
        const userId = decode.id;

        const data = {
            title: "Post Title",
            content: postContent,
            user_id: userId
        };

        const response = await axios.post(`${BASE_URL}/posts`, data);
        return response.data;
    }
);

// Slice
const postsSlice = createSlice({
    name: "posts",
    initialState: {posts: [], loading: true},
    reducers: {},   // functions inside reducers should be synchronous (executed immediately), since don't have any, so it left empty
    extraReducers: (builder) => {   // extraReducers used to handle async operations from async thunk method
        builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
        }),

        builder.addCase(savePost.fulfilled, (state, action) => {
            // state.posts = [{id: 2, "content": "hello"}]
            // ...state.posts = {id: 2, "content": "hello"}
            // action.payload = {id: 3, "content": "byebye"}
            // state.posts = [{id: 2, "content": "hello"}, {id: 3, "content": "byebye"}]
            state.posts = [action.payload, ...state.posts];     // new item will be pushed inside post array & located in front other items
        });
    },
});

export default postsSlice.reducer;