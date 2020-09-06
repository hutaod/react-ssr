import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet';
import dataJson from './data'
import PageWrapper from '../../common/components/PageWrapper'
import "./styles.scss"

class List extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { code, data, page } = this.props
    const tdk = page ? page.tdk : {}
    return (
      <Fragment>
        <Helmet>
          <title>{tdk.title}</title>
          <meta name='description' content={tdk.description} />
          <meta name='keywords' content={tdk.keywords} />
        </Helmet>
        <div>
          {data &&
            data.map((item, index) => (
              <div key={index}>
                <h3 className="haa">{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          {!data && <div>暂无数据！</div>}
        </div>
      </Fragment>
    )
  }
}

List.getInitialProps = async () => {
  const res = await new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: dataJson,
        page: {
          tdk: {
            title: '列表页',
            keywords: 'react ssr',
            description: 'react ssr'
          }
        }
      })
    }, 100)
  })
  return res
}

export default PageWrapper(List)
