import AddComment from "./components/AddComment";
import AllComments from "./components/AllComments";

function App() {
  return (
    <>
      <main className="wrapper">
        <AllComments />
        <AddComment />
      </main>
    </>
  );
}

export default App;
