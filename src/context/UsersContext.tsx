import { ReactNode, createContext } from "react";

export type UserType = {
  image: {
    png: string;
    webp: string;
  };
  username: string;
};

const currentUser = {
  image: {
    png: "./images/avatars/image-juliusomo.png",
    webp: "./images/avatars/image-juliusomo.webp",
  },
  username: "juliusomo",
};

export const UsersContext = createContext(currentUser);

const UsersProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UsersContext.Provider value={currentUser}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
