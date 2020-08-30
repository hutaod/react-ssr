import ReactRouterDOM from "react-router-dom"
import Index from "../pages/Index"
import List from "../pages/List"

/**
 * @type {Array<ReactRouterDOM.RouteProps>}
 */
const config = [
  {
    path: "/",
    component: Index,
    exact: true,
  },
  {
    path: "/list",
    component: List,
    exact: true,
  },
]

export default config