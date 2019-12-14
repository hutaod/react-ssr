import React, { useState } from 'react'

const App = ({ name }) => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h3>
        hello {name} {count}
      </h3>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Add
      </button>
    </div>
  )
}

export default <App name="哈哈" />
