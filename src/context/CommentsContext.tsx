import { createContext, ReactNode, useReducer } from "react";
import { comments, CommentsType } from "../data/data";
import { formatDateToRelative } from "../utils/DateToRelative";
import { UserType } from "./UsersContext";

type CommentsContextType = ReturnType<typeof useCommentsProvider>;

export const CommentsContext = createContext<CommentsContextType>({
  state: comments,
  dispatch: () => {},
  handleAddComments: () => {},
  handleDeleteComment: () => {},
  handleReplyComment: () => {},
  handleEditComment: () => {},
  handleVote: () => {},
});

type ACTIONTYPE =
  | { type: "add"; content: string; user: UserType }
  | { type: "remove"; id: number }
  | {
      type: "reply";
      parentId: number;
      content: string;
      user: UserType;
      replyingTo: string;
    }
  | { type: "edit"; id: number; content: string }
  | { type: "upvote"; id: number }
  | { type: "downvote"; id: number };

const useCommentsProvider = () => {
  const [state, dispatch] = useReducer(reducer, comments);

  const handleVote = (typeOfVote: "upvote" | "downvote", id: number) => {
    if (typeOfVote === "upvote") {
      dispatch({ type: "upvote", id });
    } else if (typeOfVote === "downvote") {
      dispatch({ type: "downvote", id });
    }
  };

  const handleAddComments = (content: string, user: UserType) => {
    dispatch({ type: "add", content, user });
  };

  const handleDeleteComment = (id: number) => {
    dispatch({ type: "remove", id });
  };

  const handleReplyComment = (
    parentId: number,
    content: string,
    user: UserType,
    replyTo: string
  ) => {
    dispatch({ type: "reply", parentId, content, user, replyingTo: replyTo });
  };

  const handleEditComment = (id: number, content: string) => {
    dispatch({ type: "edit", id, content });
  };

  return {
    state,
    dispatch,
    handleAddComments,
    handleDeleteComment,
    handleReplyComment,
    handleEditComment,
    handleVote,
  };
};

const reducer = (state: CommentsType[], action: ACTIONTYPE) => {
  switch (action.type) {
    case "add": {
      return [
        ...state,
        {
          id: state.length + 1,
          content: action.content,
          createdAt: formatDateToRelative(new Date()),
          score: 0,
          user: action.user,
          parentId: null,
          replyingTo: null,
          voted: 0,
        },
      ];
    }
    case "remove": {
      return state.filter((item) => item.id !== action.id);
    }
    case "reply": {
      return [
        ...state,
        {
          id: state.length + 1,
          content: action.content,
          createdAt: formatDateToRelative(new Date()),
          score: 0,
          user: action.user,
          parentId: action.parentId,
          replyingTo: action.replyingTo,
          voted: 0,
        },
      ];
    }
    case "edit": {
      return state.map((item) => {
        if (item.id === action.id) {
          return { ...item, content: action.content };
        } else {
          return item;
        }
      });
    }
    case "upvote": {
      return state.map((item) => {
        if (item.id === action.id) {
          // If the item is already upvoted, remove the upvote and decrease the score by 1
          if (item.voted === 1) {
            return { ...item, voted: 0, score: item.score - 1 };
          }
          // If the item is downvoted, change it to an upvote and increase the score by 2
          else if (item.voted === -1) {
            return { ...item, voted: 1, score: item.score + 2 };
          }
          // If the item is not voted, upvote it and increase the score by 1
          else {
            return { ...item, voted: 1, score: item.score + 1 };
          }
        } else {
          return item;
        }
      });
    }
    case "downvote": {
      return state.map((item) => {
        if (item.id === action.id) {
          if (item.voted === -1) {
            // If the item is already downvoted, set voted to 0 and increase the score by 1
            return { ...item, voted: 0, score: item.score + 1 };
          } else if (item.voted === 1) {
            // If the item is upvoted, set voted to -1 and decrease the score by 2
            return { ...item, voted: -1, score: item.score - 2 };
          } else {
            // If the item is neither upvoted nor downvoted, set voted to -1 and decrease the score by 1
            return { ...item, voted: -1, score: item.score - 1 };
          }
        } else {
          // If the item is not the one being downvoted, return it as is
          return item;
        }
      });
    }
  }
};

const CommentsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CommentsContext.Provider value={useCommentsProvider()}>
      {children}
    </CommentsContext.Provider>
  );
};

export default CommentsProvider;
