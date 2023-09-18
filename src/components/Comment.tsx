import { FormEvent, useState } from "react";
import { CommentsType } from "../data/data";
import useUsersContext from "../hooks/useUsersContext";
import Actions from "./Actions";
import AddComment from "./AddComment";
import useCommentsContext from "../hooks/useCommentsContext";

type CommentProps = {
  comment: CommentsType;
  replies: CommentsType[];
  parentId?: number | null;
};

const Comment = ({ comment, replies, parentId = null }: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useUsersContext();
  const { handleEditComment, handleVote } = useCommentsContext();
  const isUser = comment.user.username.includes(currentUser.username);

  const replyingTo = comment.replyingTo;
  const replyId = parentId ? parentId : comment.id;

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleEditForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const { newContent } = Object.fromEntries(formData.entries());
    handleEditComment(comment.id, newContent.toString());
    setIsEditing(false);
  };

  return (
    <div>
      <div className="comments__each">
        <div className="comments__profile">
          <img src={comment.user.image.webp} alt="" />
          <p className="username">
            {comment.user.username} {isUser && <span>you</span>}
          </p>
          <p className="date">{comment.createdAt}</p>
        </div>

        {isEditing && isUser ? (
          <form className="form__edit" onSubmit={handleEditForm}>
            <textarea
              name="newContent"
              className="textarea"
              defaultValue={comment.content}
              autoFocus
            />
            <button className="btn" type="submit">
              Update
            </button>
          </form>
        ) : (
          <p className="comments__comment">
            {replyingTo && <span>@{replyingTo} </span>}
            {comment.content}
          </p>
        )}

        <div className="comments__votes">
          <button
            className={comment.voted === 1 ? "active" : ""}
            onClick={() => handleVote("upvote", comment.id)}
          >
            <img src="./images/icon-plus.svg" alt="" />
            <span className="visually-hidden">upvote</span>
          </button>
          <span>{comment.score}</span>
          <button
            className={comment.voted === -1 ? "active" : ""}
            onClick={() => handleVote("downvote", comment.id)}
          >
            <img src="./images/icon-minus.svg" alt="" />
            <span className="visually-hidden">downvote</span>
          </button>
        </div>

        <Actions
          isUser={isUser}
          id={comment.id}
          toggleReply={() => setIsReplying(!isReplying)}
          toggleEdit={handleToggleEdit}
        />
      </div>
      {isReplying && (
        <div className="reply">
          <AddComment
            isReplying={isReplying}
            parentId={replyId}
            toggleReply={() => setIsReplying(!isReplying)}
            replyTo={comment.user.username}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="comments__reply">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              replies={[]}
              parentId={comment.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Comment;
