import useCommentsContext from "../hooks/useCommentsContext";
import Comment from "./Comment";

const AllComments = () => {
  const { state } = useCommentsContext();

  const comments = state.filter((item) => item.parentId === null);
  const getReplies = (commentId: number) => {
    return state.filter((item) => item.parentId === commentId);
  };

  return (
    <div className="comments">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          replies={getReplies(comment.id)}
        />
      ))}
    </div>
  );
};
export default AllComments;
