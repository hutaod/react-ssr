import React from 'react'
import AsyncBundler from "./AsyncBundler"

export default function AsyncComp(props) {
  const {load, ...rest} = props;
  return <AsyncBundler load={load}>{Comp => <Comp {...rest}/>}</AsyncBundler>
}