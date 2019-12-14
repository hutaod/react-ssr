import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

const Index = ({ name = '哈哈', courses, dispatch, history, ...restProps }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    dispatch({
      type: 'global/getCourseList'
    })
  }, [])
  return (
    <div>
      <h1>
        hello {name} {count}
      </h1>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Add
      </button>
      <h3>课程列表</h3>
      <ul>
        {courses.map((item) => (
          <li
            key={item.id}
            onClick={() => {
              history.push('/about')
            }}
          >
            <a>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default connect((state) => ({
  courses: state.global.list
}))(Index)
