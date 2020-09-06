import { demacia } from "../../demacia"
import global from "./models/global"

const initialModels = {
  global
}

// 创建并获取服务端store
export function getServerStore() {
  return demacia({ initialModels })
}

// 创建并获取客户端store
export function getClientStore() {
  const initialState = window.__INITIAL_STATE__ || {}
  return demacia({ initialState, initialModels })
}