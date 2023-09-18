import AddComment from "./components/AddComment";
import AllComments from "./components/AllComments";

function App() {
  return (
    <>
      <main className="wrapper">
        <h1 className="visually-hidden">Comments</h1>
        <AllComments />
        <AddComment />
      </main>
    </>
  );
}

export default App;
