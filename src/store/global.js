import axios from '../utils/axios'

export default {
  namespace: 'global',
  state: {
    list: [],
  },
  reducers: {
    putList(state, { payload }) {
      return {
        ...state,
        list: payload,
      }
    },
  },
  effects: {
    async getCourseList({ dispatch, $axios }, { payload }) {
      console.log($axios)

      const res = await $axios.get('/api/course/list')
      dispatch({
        type: 'putList',
        payload: res.list,
      })
    },
  },
}
