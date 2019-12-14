import reduxModel from 'demacia'
import global from './global'

// models
const initialModels = {
  global
}

export const getServerStore = () => {
  const { store } = reduxModel({ initialModels })
  return store
}

export const getClientStore = () => {
  const initialState = window.__context || {}
  const { store } = reduxModel({ initialModels, initialState })
  return store
}
