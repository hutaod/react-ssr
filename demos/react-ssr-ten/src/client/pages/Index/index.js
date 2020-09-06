import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import AsyncBundler from '../../common/components/AsyncBundler'
import PageWrapper from '../../common/components/PageWrapper'
import model from './model'
import './index.css'
console.log("hello")
class Index extends React.Component {
  constructor (props) {
    super(props)
    console.log(1)
    this.state = {
      count: 1,
      input: ''
    }
    console.log(this.props)
    this.props.getTodos()
    // this.props.dispatch({
    //   type: "global/getCourseList"
    // })
  }

  static getDerivedStateFromProps () {
    console.log(2)
    return null
  }

  // static getSnapshotBeforeUpdate() {
  //   console.log(32)
  //   return null
  // }

  componentDidMount () {
    console.log(5)
  }

  componentDidUpdate () {
    console.log(55)
  }

  shouldComponentUpdate () {
    console.log(3)
    return true
  }

  handleClick = () => {
    // alert(`嗨，一起来玩 React SSR 呀！😄`)
    this.setState({
      count: this.state.count + 1
    })
  }

  render () {
    const tdk = (this.props.page && this.props.page.tdk) || {}
    const { todos = [], total, loading } = this.props
    console.log(total)
    return (
      <Fragment>
        <Helmet>
          <title>{tdk.title}</title>
          <meta name='description' content={tdk.description} />
          <meta name='keywords' content={tdk.keywords} />
        </Helmet>
        <div>{this.state.count}</div>
        <h1 onClick={this.handleClick} className='index-box'>
          Click here！！!
        </h1>
        <AsyncBundler load={() => import('./Test')}>
          {Comp => <Comp />}
        </AsyncBundler>
        <div>
          <h2>水果蔬菜(total: {total})</h2>
          <div>
            <input
              value={this.state.input}
              onChange={e => this.setState({ input: e.target.value })}
            />
            <button
              onClick={async () => {
                await this.props.add({
                  name: this.state.input,
                  id: Math.random()
                    .toString(16)
                    .slice(2),
                  count: parseInt(Math.random() * 10)
                })
                this.setState({ input: '' })
              }}
            >
              添加
            </button>
          </div>
          {loading.includes('getTodos') ? (
            'loading...'
          ) : (
            <ul>
              {todos.map(fruit => (
                <li key={fruit.id}>{fruit.name}:{fruit.count}</li>
              ))}
            </ul>
          )}
          <div>
            <button
              onClick={() => {
                this.props.resetStore()
              }}
            >
              resetStore
            </button>
            <button
              onClick={() => {
                this.props.setStore({
                  naaa: "hahah"
                })
              }}
            >
              setStore
            </button>
          </div>
        </div>
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
          tdk: {
            title: '首页',
            keywords: 'react ssr',
            description: 'react ssr'
          }
        }
      })
    }, 100)
  })
  return res
}

export default model(PageWrapper(Index))
