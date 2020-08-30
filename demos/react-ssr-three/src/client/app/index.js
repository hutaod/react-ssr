import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import Router from "../router"
import routeConfig from "../router/route-config"
// 渲染Index组件到页面
ReactDOM.hydrate((
  <BrowserRouter>
    <Router routeList={routeConfig} />
  </BrowserRouter>
), document.getElementById("root"))
