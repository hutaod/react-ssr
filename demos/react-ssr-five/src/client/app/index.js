import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import Router from "../router"
import routeConfig from "../router/route-config"
import matchRoute from "../../share/matchRoute"

//查找路由
let route = matchRoute(document.location.pathname,routeConfig);

if(route) {
  const textArea = document.getElementById('ssrTextInitData')
  if(textArea) {
    try {
      let initialData = JSON.parse(document.getElementById('ssrTextInitData').value);
      route.initialData = initialData
    } catch (error) {}
  }
}

// 渲染Index组件到页面
ReactDOM.hydrate((
  <BrowserRouter>
    <Router routeList={routeConfig} />
  </BrowserRouter>
), document.getElementById("root"))
