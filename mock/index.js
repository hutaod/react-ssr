const express = require('express')
const app = express()

// app.get('*', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
//   res.header('Content-Type', 'application/json;charset=utf-8')
//   next()
// })

app.get('/api/course/list', (req, res) => {
  res.json({
    code: 0,
    list: [
      { name: 'Web前端', id: 1 },
      { name: 'Java', id: 2 },
    ],
  })
})

app.get('/api/user/info', (req, res) => {
  res.json({
    code: 0,
    data: {
      name: 'hellott',
      age: 25,
    },
  })
})

app.listen(9090, () => {
  console.log('mock at 9090')
})
