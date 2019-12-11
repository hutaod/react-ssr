import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'

const App = () => {
  return (
    <div>
      <Route path="/" exact component={Home} />
      <Route path="/detail" exact component={Detail} />
    </div>
  )
}

export default <App />
