import React from 'react'
import { Route } from 'react-router-dom'

function Status({ status, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.status = status
        }
        return children
      }}
    />
  )
}

function NotFound() {
  return (
    <Status status={404}>
      <h1>404页面</h1>
      <img src="https://media.istockphoto.com/vectors/error-404-vector-id538038858" />
    </Status>
  )
}

export default NotFound
