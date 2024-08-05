import { useState } from "react";
import PostList from "./components/PostList";
import { Button } from "./components/ui/button";

function App() {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <div className="">
      <Button onClick={() => setToggle(!toggle)}>Toggle</Button>
      {toggle ? <PostList /> : <span>Data is not here</span>}
    </div>
  );
}

export default App;
