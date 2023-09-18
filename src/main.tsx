import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./scss/style.css";
import UsersProvider from "./context/UsersContext.tsx";
import CommentsProvider from "./context/CommentsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UsersProvider>
      <CommentsProvider>
        <App />
      </CommentsProvider>
    </UsersProvider>
  </React.StrictMode>
);
