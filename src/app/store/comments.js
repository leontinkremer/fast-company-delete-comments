import { createAction, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";
import prepareComment from "../utils/prepareComment";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        commentRemoved: (state, action) => {
            state.entities = state.entities.filter(
                (el) => el._id !== action.payload
            );
            state.isLoading = false;
        },
        removeCommentRequested: (state) => {
            state.isLoading = true;
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFailed,
    commentCreated,
    commentRemoved,
    removeCommentRequested
} = actions;

const createCommentRequested = createAction("comments/createCommentRequested");
const createCommentFailed = createAction("comments/createCommentFailed");

const removeCommentFailed = createAction("comments/removeCommentFailed");

export const createComment =
    (data, currentUserId, userId) => async (dispatch) => {
        dispatch(createCommentRequested());
        const comment = prepareComment(data, currentUserId, userId);
        try {
            const { content } = await commentService.createComment(comment);
            dispatch(commentCreated(content));
        } catch (error) {
            dispatch(createCommentFailed(error.message));
        }
        console.log(comment);
    };

export const removeComment = (payload) => async (dispatch) => {
    console.log("payload", payload);
    dispatch(removeCommentRequested());
    try {
        await commentService.removeComment(payload);
        dispatch(commentRemoved(payload));
    } catch (error) {
        dispatch(removeCommentFailed(error.message));
    }
};

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLength = () => (state) => {
    return !state.comments.isLoading && state.comments.entities.length;
};
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
