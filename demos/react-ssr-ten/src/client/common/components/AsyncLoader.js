import React from 'react'
import AsyncComp from "./AsyncComp"
import proConfig from "../../../share/pro-config"

export default (loader) => {
  function AsyncHoc(props) {
    return <AsyncComp load={loader} {...props} />
  }
  AsyncHoc[proConfig.asyncComponentKey] = true
  return AsyncHoc
}