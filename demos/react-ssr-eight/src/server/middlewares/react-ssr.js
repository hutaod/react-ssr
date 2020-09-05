import React from "react"
import Router from "../../client/router"
import routeConfig from "../../client/router/route-config"
import { StaticRouter, matchPath } from "react-router-dom"
import { renderToString } from "react-dom/server"
import { Helmet } from 'react-helmet';
// import pathToRegexp from "path-to-regexp"
import matchRoute from "../../share/matchRoute"
import proConfig from "../../share/pro-config"
//导入资源处理库
const getAssets = require('../common/assets');
//得到静态资源
const assetsMap = getAssets();

function checkRouterIsAsync(route) {
  return !!route[proConfig.asyncComponentKey]
}

// 用于将动态路由转换为静态路由
async function getStaticRoutes(routes) {
  const staticsRoutes = []
  for(let i = 0; i < routes.length; i++) {
    const route = routes[i]
    if(checkRouterIsAsync(route.component)) {
      staticsRoutes.push({
        ...route,
        component: (await routes[i].component().props.load()).default
      })
    } else {
      staticsRoutes.push(routes[i])
    }
  }
  return staticsRoutes
}


export default async (ctx, next) => {
  const path = ctx.path
  const context = {
    initialData: null
  }
  const routeList = await getStaticRoutes(routeConfig);
  const route = matchRoute(path, routeList)
  if(route && route.component.getInitialProps) {
    try {
      context.initialData = await route.component.getInitialProps()
    } catch (error) {
      console.log(error)
    }
  }
  // console.log(route, 0, context)
  // 将组件转换为 html
  const html = renderToString(
    <StaticRouter location={ctx.url} context={context}>
      <Router routeList={routeList} />
    </StaticRouter>
  )

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
      ${assetsMap.js.join('')}
    </body>
    </html>
  `)
  await next()
}