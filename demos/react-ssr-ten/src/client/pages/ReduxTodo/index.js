import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import PageWrapper from '../../common/components/PageWrapper'
import model from './model'

class ReduxTodo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      input: ''
    }
    this.props.getTodos()
  }

  componentWillUnmount() {
    // redux数据会存储在缓存中，这里进行强制重置数据
    this.props.resetStore()
  }

  render () {
    const { todos = [], total, loading } = this.props
    return (
      <Fragment>
        <Helmet>
          <title>Redux TODO</title>
          <meta name='description' content="Redux TODO" />
          <meta name='keywords' content="Redux TODO" />
        </Helmet>
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

export default model(PageWrapper(ReduxTodo))
