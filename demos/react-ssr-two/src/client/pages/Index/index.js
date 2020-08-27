import React from 'react';

export default class Index extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick = () => {
    alert(`嗨，一起来玩 React SSR 呀！😄`)
  }

  render() {
    return <h1 onClick={this.handleClick}>Click here!</h1>
  }
}