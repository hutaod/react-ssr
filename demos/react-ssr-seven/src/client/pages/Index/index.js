import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import "./index.css"

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    console.log(1)
    this.state = {
      count: 1
    }
  }

  static getDerivedStateFromProps() {
    console.log(2)
    return null
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
    return true
  }

  handleClick = () => {
    // alert(`嗨，一起来玩 React SSR 呀！😄`)
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    const tdk = this.props.page && this.props.page.tdk || {}
    return (
      <Fragment>
        <Helmet>
          <title>{tdk.title}</title>
          <meta name="description" content={tdk.description} />
          <meta name="keywords" content={tdk.keywords} />
        </Helmet>
        <div>{this.state.count}</div>
        <h1 onClick={this.handleClick} className="index-box">Click here!</h1>
      </Fragment>
    )
  }
}

Index.getInitialProps = async () => {
  const res = await new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 0,
        page: {
          tdk:{
            title:'列表页',
            keywords:'react ssr',
            description:'react ssr'
          }
        }
      })
    }, 100)
  })
  return res
}