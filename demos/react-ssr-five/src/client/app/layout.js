import React from "react"
import { Link } from "react-router-dom"
import "./layout.scss"

export default class Layout extends React.Component {
  render() {
    return (
      <div className="layout-box">
        <Link to="/">首页</Link>
        <Link to="/list">列表页</Link>
        <div>{this.props.children}</div>
      </div>
    )
  }
}