import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from '../src/App'
import store from '../src/store'

const Root = (
  <Provider store={store}>
    <BrowserRouter>{App}</BrowserRouter>
  </Provider>
)

export default ReactDom.hydrate(Root, document.getElementById('root'))
