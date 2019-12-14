import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import axios from '../utils/axios'
import { model } from '../redux-model'

model({
  namespace: 'user',
  state: {
    userInfo: {}
  },
  reducers: {
    putUser(state, { payload }) {
      return {
        ...state,
        userInfo: payload
      }
    }
  },
  effects: {
    async getUserInfo({ dispatch }, { payload }) {
      const res = await axios.get('/api/user/info')
      dispatch({
        type: 'putUser',
        payload: res.data
      })
    }
  }
})

const User = ({ userInfo, dispatch }) => {
  useEffect(() => {
    if (!userInfo.name) {
      dispatch({
        type: 'user/getUserInfo'
      })
    }
  }, [])
  return (
    <div>
      <h1>
        hello {userInfo.name} {userInfo.age}
      </h1>
    </div>
  )
}

User.loadData = ({ dispatch }) => {
  return dispatch({
    type: 'user/getUserInfo'
  })
}

export default connect((state) => {
  return {
    userInfo: state.user.userInfo
  }
})(User)
