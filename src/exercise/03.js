// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {useContext, useState} from "react";

const CountContext = React.createContext({
    count: 0,
    setCount: () => {}
});

function CountProvider({children}) {
    const [count, setCount] = useState(0);

    return <CountContext.Provider value={{count, setCount}}>
        {children}
    </CountContext.Provider>;
}


function CountDisplay() {
  const {count} = useContext(CountContext);
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  const {setCount} = useContext(CountContext);
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
      <div>
        <CountProvider>
          <CountDisplay/>
          <Counter/>
        </CountProvider>
      </div>
  )
}

export default App
