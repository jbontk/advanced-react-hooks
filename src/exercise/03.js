// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {useContext, useState} from "react";

const CountContext = React.createContext();

function CountProvider({children}) {
    const [count, setCount] = useState(0);

    return <CountContext.Provider value={[count, setCount]}>
        {children}
    </CountContext.Provider>;
}

const useCount = () => {
    const countContextValue = useContext(CountContext);

    if (!countContextValue) throw Error('useCount hook must be used within a CountProvider');

    return countContextValue;
}


function CountDisplay() {
  const count = useCount()[0];
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  const setCount = useCount()[1];
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
