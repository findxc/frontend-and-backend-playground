// 不需要考虑 cookie 时的跨域设置

const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('dev'))

const PORT = 3000

app.all('*', function (req, res, next) {
  // 不允许浏览器缓存请求结果，否则可能响应头变化后，前端是使用的缓存，没拿到最新的响应头
  res.header('Cache-Control', 'no-store')
  // 所有请求的响应中都需要设置 Access-Control-Allow-Origin
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.options('*', (req, res) => {
  // Access-Control-Allow-Headers 和 Access-Control-Allow-Methods 只用在 OPTIONS 请求的响应中设置
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.send({ msg: 'success' })
})

app.get('/cors', (req, res) => {
  res.send({ msg: 'success' })
})

app.post('/cors', (req, res) => {
  res.send({ msg: 'success' })
})

app.delete('/cors', (req, res) => {
  res.send({ msg: 'success' })
})

app.put('/cors', (req, res) => {
  res.send({ msg: 'success' })
})

let sessionId = 1
app.post('/login', (req, res) => {
  sessionId++
  // 这个请求不会报错，但是实际上 cookie 并不会成功设置到前端域上
  // 同样，就算前端域上有 cookie ，在发请求时也不会发给后端
  res.cookie('sessionId', String(sessionId)).send({ msg: 'success' })
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
