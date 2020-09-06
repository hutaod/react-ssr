import React from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "../router"
import { hot } from "react-hot-loader/root"

function App({ routeList }) {
  return (
    <BrowserRouter>
      <Router routeList={routeList} />
    </BrowserRouter>
  )
}

export default hot(App)