import React from 'react';
import dataJson from "./data"

export default class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      code: props.code
    }
  }

  componentDidMount() {
    if(!this.props.data) {
      console.log("客户端请求")
      List.getInitialProps().then(res => {
        this.setState({ ...res })
      })
    }
  }

  render() {
    const { code, data } = this.state
    // console.log(111, this.props)
    return <div>
      {data&&data.map((item, index) => (
        <div key={index}>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
      {!data && <div>暂无数据！</div>}
    </div>
  }
}


List.getInitialProps = async () => {
  const res = await new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: dataJson
      })
    }, 100)
  })
  return res
}
