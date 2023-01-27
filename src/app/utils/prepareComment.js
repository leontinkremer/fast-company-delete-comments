import { nanoid } from "nanoid";

function prepareComment(data, currentUserId, userId) {
    const comment = {
        ...data,
        _id: nanoid(),
        pageId: userId,
        created_at: Date.now(),
        userId: currentUserId
    };
    return comment;
}

export default prepareComment;
