import { matchPath } from "react-router-dom"

const matchRoute = (path, routeList) => {
  let route = routeList.find(item => matchPath(path, item));
  return route
}

export default matchRoute