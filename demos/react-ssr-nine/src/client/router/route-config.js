import ReactRouterDOM from "react-router-dom"
import AsyncLoader from "../common/components/AsyncLoader"

/**
 * @type {Array<ReactRouterDOM.RouteProps>}
 */
const config = [
  {
    path: "/",
    component: AsyncLoader(() => import(/*webpackChunkName:"chunk-index"*/"../pages/Index")),
    exact: true,
  },
  {
    path: "/list",
    component: AsyncLoader(() => import("../pages/List")),
    exact: true,
  },
]

export default config