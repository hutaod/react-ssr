import React from 'react'
import isNode from 'detect-node'

export default Comp => {
  return class PageWrapperHoc extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        initialData: null
      }
      if (!isNode) {
        // 客户端渲染从 window.__INITIAL_DATA__ 获取数据
        this.state.initialData = window.__INITIAL_DATA__
        // 缓存一份服务端渲染的数据，以防用到，可能没用，实际开发中可以去掉
        window.__INITIAL_DATA_CACHE__ =
          window.__INITIAL_DATA_CACHE__ || window.__INITIAL_DATA__
        // 清除注入的数据，以便下一次进入该页面的时候重新获取数据
        window.__INITIAL_DATA__ = null
      } else {
        // 服务端渲染从staticContext.initialData上获取数据
        this.state.initialData = props.staticContext.initialData
      }
    }

    static async getInitialProps (ctx) {
      return Comp.getInitialProps ? await Comp.getInitialProps(ctx) : null
    }

    async getInitialData () {
      const { match, location } = this.props
      const res = await Comp.getInitialProps({ match, location })
      this.setState({
        initialData: res
      })
    }

    componentDidMount () {
      // 未从服务端获取数据时
      if (!this.state.initialData && Comp.getInitialProps) {
        this.getInitialData()
      }
    }

    render () {
      let initialData = this.state.initialData || {}
      return <Comp {...this.props} {...initialData} />
    }
  }
}
