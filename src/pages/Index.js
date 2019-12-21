import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withStyle from './withStyle'
import styles from './styles.css'

const Index = ({ name = '哈哈', courses, dispatch, history, ...restProps }) => {
  const [count, setCount] = useState(0)
  // console.log('courses', courses)
  // if (restProps.staticContext) {
  //   restProps.staticContext.css.push(styles)
  // }

  useEffect(() => {
    if (courses.length === 0) {
      dispatch({
        type: 'global/getCourseList',
      })
    }
  }, [])
  return (
    <div>
      <h1 className={styles.title}>
        hello1 {name} {count}
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

Index.loadData = ({ dispatch }) => {
  return dispatch({
    type: 'global/getCourseList',
  })
}

export default connect((state) => ({
  courses: state.global.list,
}))(withStyle(Index, styles))
