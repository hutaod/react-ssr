import Layout from "../app/layout"
import React from 'react'
import { Route, Switch } from 'react-router-dom'

function Router({ routeList }) {
  return (
    <Layout>
      <Switch>
        {routeList.map(item => (
          <Route key={item.path} {...item} component={undefined} render={props => {
            const staticContext = props.staticContext || {}
            const extraProps = {
              ...(staticContext.initialData || {}),
              ...(item.initialData || {})
            }
            return <item.component {...props} {...extraProps} />
          }} />
        ))}
      </Switch>
    </Layout>
  )
}

export default Router