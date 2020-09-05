import React from 'react'

export default class AsyncBundle extends React.Component {
  state = {
    mod: null, // 自身状态
  };

  componentDidMount() {
    if(!this.mod) {
      this.load();
    }
  }

  load() {
    this.setState({
      mod: null
    })
    this.props.load().then(mod => {
      this.setState({
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : 'loading'
  }
}