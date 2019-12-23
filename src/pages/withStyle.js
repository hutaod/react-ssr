import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'

export default function withStyle(Comp, styles) {
  function Hoc(props) {
    if (props.staticContext) {
      props.staticContext.css.push(styles._getCss())
    }
    return <Comp {...props} />
  }

  hoistNonReactStatic(Hoc, Comp)
  Hoc.displayName = Comp.displayName || Comp.name || 'Component'

  return Hoc
}
