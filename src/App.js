import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import Index from './pages/Index'
import About from './pages/About'

const App = () => {
  return (
    <div>
      <Route path="/" exact component={Index} />
      <Route path="/about" exact component={About} />
    </div>
  )
}

export default <App />
