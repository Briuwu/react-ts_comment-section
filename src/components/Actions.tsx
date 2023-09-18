import useCommentsContext from "../hooks/useCommentsContext";

type ActionsProps = {
  isUser: boolean;
  id: number;
  toggleReply: () => void;
  toggleEdit: () => void;
};

const Actions = ({ isUser, id, toggleReply, toggleEdit }: ActionsProps) => {
  const { handleDeleteComment } = useCommentsContext();
  return (
    <div className="comments__action">
      {isUser && (
        <div>
          <button className="delete" onClick={() => handleDeleteComment(id)}>
            <img src="./images/icon-delete.svg" alt="" />
            <span>Delete</span>
          </button>
        </div>
      )}
      {!isUser && (
        <button className="reply_btn" onClick={() => toggleReply()}>
          <img src="./images/icon-reply.svg" alt="" />
          <span>Reply</span>
        </button>
      )}
      {isUser && (
        <button className="edit" onClick={() => toggleEdit()}>
          <img src="./images/icon-edit.svg" alt="" />
          <span>Edit</span>
        </button>
      )}
    </div>
  );
};
export default Actions;
