import React from 'react'

const Detail = ({ history }) => {
  return (
    <div>
      <h1>详情页</h1>
      <button
        onClick={() => {
          history.goBack()
        }}
      >
        返回上一页
      </button>
    </div>
  )
}

export default Detail
