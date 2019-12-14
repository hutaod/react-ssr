import React from 'react'

const About = ({ history }) => {
  return (
    <div>
      <h1>About</h1>
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

export default About
