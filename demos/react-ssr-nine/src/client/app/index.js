import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import Router from "../router"
import routeConfig from "../router/route-config"
import matchRoute from "../../share/matchRoute"
import proConfig from "../../share/pro-config"

// 提取出挂载到 dom 的方法
function renderDom(routeList) {
  // 渲染Index组件到页面
  ReactDOM.hydrate((
    <BrowserRouter>
      <Router routeList={routeList} />
    </BrowserRouter>
  ), document.getElementById("root"))  
}

// 渲染入口
function clientRender(routeList) {
  //查找路由
  let route = matchRoute(document.location.pathname,routeList);

  if(route) {
    const textArea = document.getElementById('ssrTextInitData')
    if(textArea) {
      try {
        let initialData = JSON.parse(document.getElementById('ssrTextInitData').value);
        window.__INITIAL_DATA__ = initialData;
      } catch (error) {}
    }
  }
  if(route && route.component[proConfig.asyncComponentKey]) {
    route.component().props.load().then(comp => {
      //异步组件加载完成后再渲染页面
      console.log('异步组件加完成');
      // 把route对应的component改变为非按需加载的方式，因为已经加载过了，不再需要了，否则虽然因为已经加载过对应的js，但还是会重新执行按需加载对应的方法，控制台依然会报错
      route.component = comp.default ? comp.default : comp
      renderDom(routeList)
    })
  } else {
    console.log(222)
    renderDom(routeList)
  }
}

clientRender(routeConfig);

// 只有在开发环境才启用热更新
if (process.env.NODE_ENV === 'development' &&  module.hot) {
  module.hot.accept();
}