import axios from 'axios'

export default {
  namespace: 'global',
  state: {
    list: []
  },
  reducers: {
    putList(state, { payload }) {
      return {
        ...state,
        list: payload
      }
    }
  },
  effects: {
    getCourseList({ dispatch }, { payload }) {
      return axios.get('http://localhost:9090/api/course/list').then((res) => {
        dispatch({
          type: 'putList',
          payload: res.data.list
        })
      })
    }
  }
}
