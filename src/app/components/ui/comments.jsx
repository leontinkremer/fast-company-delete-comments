import { orderBy } from "lodash";
import React, { useEffect } from "react";
import CommentsList, { AddCommentForm } from "../common/comments";
import { useComments } from "../../hooks/useComments";
import { useDispatch, useSelector } from "react-redux";
import {
    createComment,
    getComments,
    getCommentsLength,
    getCommentsLoadingStatus,
    loadCommentsList,
    removeComment
} from "../../store/comments";
import { useParams } from "react-router-dom";
import { getCurrentUserId } from "../../store/users";

const Comments = () => {
    const { userId } = useParams();
    const currentUserId = useSelector(getCurrentUserId());
    const dispatch = useDispatch();
    const isLoading = useSelector(getCommentsLoadingStatus());
    useEffect(() => {
        dispatch(loadCommentsList(userId));
    }, [userId]);

    // const commentsLength = useSelector(getCommentsLength());
    // console.log("commentsLength", commentsLength);

    // useEffect(() => {
    //     dispatch(loadCommentsList(userId));
    // }, [commentsLength]);

    // const { removeComment } = useComments();
    const comments = useSelector(getComments());

    const handleSubmit = (data) => {
        // createComment(data);
        dispatch(createComment(data, currentUserId, userId));
    };
    const handleRemoveComment = (id) => {
        // removeComment(id);
        dispatch(removeComment(id));
    };
    const sortedComments = orderBy(comments, ["created_at"], ["desc"]);
    return (
        <>
            <div className="card mb-2">
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && (
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <hr />
                        {!isLoading ? (
                            <CommentsList
                                comments={sortedComments}
                                onRemove={handleRemoveComment}
                            />
                        ) : (
                            "Loading..."
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Comments;
