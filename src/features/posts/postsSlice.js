import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc,
    updateDoc,
    deleteDoc 
} from "firebase/firestore";
import { db } from "../../firebase";

// Async thunk for fetching a user's posts. If we want to use redux, all API call should be in async thunk, not in other pages.
export const fetchPostsByUser = createAsyncThunk(   // async thunk method is used to handle asynchronous operation. Instead of making entire website loading, we can use this to make only specific part in the website loading.
    "posts/fetchByUser",    // this name does not affect the function. It is a good practice to put it same as variable name 
    async (userId) => {
        try {
            const postsRef = collection(db, `users/${userId}/posts`);

            const querySnapshot = await getDocs(postsRef);
            const docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return docs;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const savePost = createAsyncThunk(
    "post/savePost",
    async ({ userId, postContent }) => {
        try {
            const postsRef = collection(db, `users/${userId}/posts`);
            console.log(`users/${userId}/posts`);
            // Since no ID is given, Firestore auto generate a unique ID (UID) for this new document
            const newPostRef = doc(postsRef);
            console.log(postContent);
            await setDoc(newPostRef, { content: postContent, likes: [] });
            const newPost = await getDoc(newPostRef);

            const post = {
                id: newPost.id,
                ...newPost.data(),
            };

            return post;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const likePost = createAsyncThunk(
    "posts/likePost",
    async ({ userId, postId }) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`);

            const docSnap = await getDoc(postRef);

            if (docSnap.exists()) {
                const postData = docSnap.data();
                const likes = [...postData.likes, userId];

                await setDoc(postRef, { ...postData, likes });
            }

            return { userId, postId };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const removeLikeFromPost = createAsyncThunk(
    "posts/removeLikeFromPost",
    async ({ userId, postId }) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`);

            const docSnap = await getDoc(postRef);

            if (docSnap.exists()) {
                const postData = docSnap.data();
                const likes = postData.likes.filter((id) => id !== userId);

                await setDoc(postRef, { ...postData, likes });
            }

            return { userId, postId };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const updatePost = createAsyncThunk(
    "posts/updatePost",
    async ({ userId, postId, newPostContent }) => {
        try {
            // Reference to the existing post
            const postRef = doc(db, `users/${userId}/posts/${postId}`);
            // Get the current post data
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const postData = postSnap.data();
                // Update the post content
                const updatedData = {
                    ...postData,
                    content: newPostContent || postData.content,
                };
                // Update the existing document in Firestore
                await updateDoc(postRef, updatedData);
                // Return the post with updated data
                const updatedPost = { id: postId, ...updatedData };
                return updatedPost;
            } else {
                throw new Error("Post does not exist");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async ({ userId, postId }) => {
        try {
            // Reference to the post
            const postRef = doc(db, `users/${userId}/posts/${postId}`);
            // Delete the post
            await deleteDoc(postRef);
            // Return the ID of the deleted post
            return postId;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

// Slice
const postsSlice = createSlice({
    name: "posts",
    initialState: {posts: [], loading: true},
    reducers: {},   // functions inside reducers should be synchronous (executed immediately), since don't have any, so it left empty
    extraReducers: (builder) => {   // extraReducers used to handle async operations from async thunk method
        builder
            .addCase(fetchPostsByUser.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.loading = false;
            })

            .addCase(savePost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts];     // new item will be pushed inside post array & located in front other items
            })

            .addCase(likePost.fulfilled, (state, action) => {
                const { userId, postId } = action.payload;

                const postIndex = state.posts.findIndex((post) => post.id === postId);

                if (postIndex !== -1) {
                    state.posts[postIndex].likes.push(userId);
                }
            })

            .addCase(removeLikeFromPost.fulfilled, (state, action) => {
                const { userId, postId } = action.payload;

                const postIndex = state.posts.findIndex((post) => post.id === postId);

                if (postIndex !== -1) {
                    state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
                        (id) => id !== userId
                    );
                }
            })

            .addCase(updatePost.fulfilled, (state, action) => {
                const updatedPost = action.payload;
                // Find and update the post in the state
                const postIndex = state.posts.findIndex(
                    (post) => post.id === updatedPost.id
                );

                if (postIndex !== -1) {
                    state.posts[postIndex] = updatedPost;
                } 
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                const deletedPostId = action.payload;
                // Filter out the deleted post from state
                state.posts = state.posts.filter((post) => post.id !== deletedPostId);
            });
    },
});

export default postsSlice.reducer;