import React from "react"
import Router from "../../client/router"
import routeConfig from "../../client/router/route-config"
import { StaticRouter, matchPath } from "react-router-dom"
import { renderToString } from "react-dom/server"
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux'
// import pathToRegexp from "path-to-regexp"
import matchRoute from "../../share/matchRoute"
import proConfig from "../../share/pro-config"
import { getServerStore } from "../../share/store"
//导入资源处理库
const getAssets = require('../common/assets');
//得到静态资源
const assetsMap = getAssets();

function checkRouterIsAsync(route) {
  return !!route[proConfig.asyncComponentKey]
}

// 用于将动态路由转换为静态路由
async function getStaticRoutes(routes, path) {
  const staticsRoutes = []
  for(let i = 0; i < routes.length; i++) {
    const route = routes[i]
    if(matchPath(path, route)) {
      if(checkRouterIsAsync(route.component)) {
        staticsRoutes.push({
          ...route,
          component: (await routes[i].component().props.load()).default
        })
      } else {
        staticsRoutes.push(routes[i])
      }
    }
  }
  return staticsRoutes
}

async function handleReduxEffects(store) {
  try {
    const allPromise = store.runEffects()
    await Promise.all(allPromise)
    console.log(5555)
  } catch (error) {
    console.log(error)
  }
}


export default async (ctx, next) => {
  const path = ctx.path
  const context = {
    initialData: null
  }
  const routeList = await getStaticRoutes(routeConfig, path);
  const store = getServerStore()
  
  // 仅支持一级路由
  const route = matchRoute(path, routeList)
  if(route && typeof route.component.getInitialProps === 'function') {
    try {
      context.initialData = await route.component.getInitialProps()
    } catch (error) {
      console.log(error)
    }
  }
  try {
    // 先尝试渲染一次，以便后面能获取到更新后的store数据
    renderToString(
      <Provider store={store}>
        <StaticRouter location={ctx.url} context={context}>
          <Router routeList={routeList} />
        </StaticRouter>
      </Provider>
    )
  } catch (error) {
    console.error(error)
  }
  console.log("getState", store.getState())

  // 处理有redux的情况，需要在renderToString后，
  // 这时才能正确的收集到服务端发起的请求
  await handleReduxEffects(store)
  // 处理完effects后，就可以获取到更新后的state了
  console.log("getState", store.getState())
  let html
  try {
    html = renderToString(
      <Provider store={store}>
        <StaticRouter location={ctx.url} context={context}>
          <Router routeList={routeList} />
        </StaticRouter>
      </Provider>
    )
  } catch (error) {
    console.log(error)
  }

  const helmet = Helmet.renderStatic();

  ctx.body = (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${assetsMap.css.join('')}
    </head>
    <body>
      <div id="root">${html}</div>
      <textarea id="ssrTextInitData" style="display:none;">
        ${JSON.stringify(context.initialData || {})}
      </textarea>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}
      </script>
      ${assetsMap.js.join('')}
    </body>
    </html>
  `)
  await next()
}