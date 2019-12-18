import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import routes from '../src/App'
import Header from '../src/components/Header'
import { getClientStore } from '../src/store'

const Root = (
  <Provider store={getClientStore()}>
    <BrowserRouter>
      <Header />
      <Switch>
        {routes.map((route) => (
          <Route {...route} />
        ))}
      </Switch>
    </BrowserRouter>
  </Provider>
)

export default ReactDom.hydrate(Root, document.getElementById('root'))
