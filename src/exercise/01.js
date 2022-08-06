// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

const countReducer = (currentState, action) => {
  if (action.type === 'increment') {
    return {...currentState, count: currentState.count + 1};
  }
}

function Counter({initialCount = 0, step = 1}) {
  const [state, dispatch] = React.useReducer(countReducer, {count: initialCount})

  const increment = () => dispatch({type: 'increment'})
  return <button onClick={increment}>{state.count}</button>
}

function App() {
  return <Counter />
}

export default App
