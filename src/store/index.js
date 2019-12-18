import axios from 'axios'
import reduxModel from '../redux-model'
import global from './global'
import { createAxios } from '../utils/axios'

// 1. 创建client axios实例
const clientAxios = createAxios({
  baseURL: '/',
})

// 2. 创建server axios实例
const serverAxios = createAxios({
  baseURL: 'http://localhost:8091/',
})

// models
const initialModels = {
  global,
}

export const getServerStore = () => {
  const { store } = reduxModel({
    initialModels,
    effectsExtraArgument: {
      $axios: serverAxios,
    },
  })
  return store
}

export const getClientStore = () => {
  const initialState = window.__context || {}
  const { store } = reduxModel({
    initialModels,
    initialState,
    effectsExtraArgument: {
      $axios: clientAxios,
    },
  })
  return store
}
