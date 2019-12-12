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
    async getCourseList({ dispatch }, { payload }) {
      const res = await axios.get('http://localhost:9090/api/course/list')
      dispatch({
        type: 'putList',
        payload: res.data.list
      })
    }
  }
}
