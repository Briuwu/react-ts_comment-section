import { useState } from "react";
import useUsersContext from "../hooks/useUsersContext";
import useCommentsContext from "../hooks/useCommentsContext";

type AddCommentProps = {
  isReplying?: boolean;
  parentId?: number;
  toggleReply?: () => void;
  replyTo?: string;
};

const AddComment = ({
  isReplying,
  parentId,
  toggleReply,
  replyTo,
}: AddCommentProps) => {
  const currentUser = useUsersContext();
  const { handleAddComments, handleReplyComment } = useCommentsContext();
  const [post, setPost] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!post) return;

    if (isReplying && toggleReply && replyTo && parentId) {
      handleReplyComment(parentId, post, currentUser, replyTo);
      toggleReply();
      return;
    }

    handleAddComments(post, currentUser);
    setPost("");
  };

  return (
    <form className="input" onSubmit={handleSubmit}>
      <img src={currentUser.image.webp} alt="" />
      <textarea
        value={post}
        onChange={(e) => setPost(e.target.value)}
        placeholder="Add a comment..."
        className="textarea"
      />
      <button disabled={!post} className="btn" type="submit">
        Send
      </button>
    </form>
  );
};
export default AddComment;
