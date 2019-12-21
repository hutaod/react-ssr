import React from 'react'

export default function withStyle(Comp, styles) {
  return function Hoc(props) {
    if (props.staticContext) {
      props.staticContext.css.push(styles._getCss())
    }
    return <Comp {...props} />
  }
}
