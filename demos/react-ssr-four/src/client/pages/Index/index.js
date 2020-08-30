import React from 'react';

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    console.log(1)
    this.state = {
      test: 123
    }
  }

  static getDerivedStateFromProps() {
    console.log(2)
    return null
  }

  static getInitialProps = async () => {
    const data = await new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: "哈哈😄"
        })
      }, 100)
    })
    return { data }
  }

  // static getSnapshotBeforeUpdate() {
  //   console.log(32)
  //   return null
  // }

  componentDidMount() {
    console.log(5)
  }

  componentDidUpdate() {
    console.log(55)
  }

  shouldComponentUpdate() {
    console.log(3)
  }

  handleClick = () => {
    alert(`嗨，一起来玩 React SSR 呀！😄`)
  }

  render() {
    console.log(4, this.props)
    return <h1 onClick={this.handleClick}>Click here!</h1>
  }
}
