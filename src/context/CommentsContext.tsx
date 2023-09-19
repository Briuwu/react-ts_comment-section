import { createContext, ReactNode, useReducer, useEffect } from "react";
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
  const initialState = localStorage.getItem("comments")
    ? JSON.parse(localStorage.getItem("comments")!)
    : comments;
  const [state, dispatch] = useReducer(reducer, initialState);

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
  const currentDate = new Date();

  switch (action.type) {
    case "add": {
      const newComment = {
        id: state.length + 1,
        content: action.content,
        createdAt: formatDateToRelative(currentDate),
        score: 0,
        user: action.user,
        parentId: null,
        replyingTo: null,
        voted: 0,
      };

      const newState = [...state, newComment];

      return newState;
    }
    case "remove": {
      const newState = state.filter((item) => item.id !== action.id);

      return newState;
    }
    case "reply": {
      const newComment = {
        id: state.length + 1,
        content: action.content,
        createdAt: formatDateToRelative(currentDate),
        score: 0,
        user: action.user,
        parentId: action.parentId,
        replyingTo: action.replyingTo,
        voted: 0,
      };

      const newState = [...state, newComment];

      return newState;
    }
    case "edit": {
      const newState = state.map((item) => {
        if (item.id === action.id) {
          return { ...item, content: action.content };
        } else {
          return item;
        }
      });

      return newState;
    }
    case "upvote": {
      const newState = state.map((item) => {
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

      return newState;
    }
    case "downvote": {
      const newState = state.map((item) => {
        if (item.id === action.id) {
          if (item.voted === -1) {
            return { ...item, voted: 0, score: item.score + 1 };
          } else if (item.voted === 1) {
            return { ...item, voted: -1, score: item.score - 2 };
          } else {
            return { ...item, voted: -1, score: item.score - 1 };
          }
        } else {
          return item;
        }
      });

      return newState;
    }
  }
};

const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const { state, ...rest } = useCommentsProvider();

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(state));
  }, [state]);

  return (
    <CommentsContext.Provider value={{ state, ...rest }}>
      {children}
    </CommentsContext.Provider>
  );
};

export default CommentsProvider;
