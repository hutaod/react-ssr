import reduxModel from '../redux-model'
import global from './global'

// models
const initialModels = {
  global
}

const { store } = reduxModel({ initialModels })

export default store
