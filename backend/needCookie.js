// 考虑 cookie 时的跨域设置

const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('dev'))

const PORT = 3000

const originWhiteList = [
  'http://localhost:5000',
]

app.all('*', function (req, res, next) {
  // 不允许浏览器缓存请求结果，否则可能响应头变化后，前端是使用的缓存，没拿到最新的响应头
  res.header('Cache-Control', 'no-store')

  const originFind = originWhiteList.find(x => x === req.headers.origin)
  // 只允许白名单里面的域跨域访问
  if(originFind) {
    // 所有请求的响应中都需要设置 Access-Control-Allow-Origin
    // 并且不能为 *
    res.header('Access-Control-Allow-Origin', originFind)
    // 所有请求的响应中都需要设置 Access-Control-Allow-Credentials
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
  } else {
    res.send({ msg: 'success' })
  }
})

app.options('*', (req, res) => {
  // Access-Control-Allow-Headers 和 Access-Control-Allow-Methods 只用在 OPTIONS 请求的响应中设置
  // 并且设为 * 是无效的
  res.header('Access-Control-Allow-Headers', 'content-type,custom-hhh')
  res.header('Access-Control-Allow-Methods', 'PUT,DELETE')
  // options 请求允许缓存多少秒
  res.header('Access-Control-Max-Age', '10')
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
  // 如果某个请求中有设置自定义响应头，那么还需要设置 Access-Control-Expose-Headers 后前端才能读取这个 header
  res.header('custom-hhh', '123')
  res.header('Access-Control-Expose-Headers', 'custom-hhh')

  sessionId++
  // 现在 set-cookie 会成功设到前端域上
  // 前端在发请求时也会携带 cookie 给服务端了
  res.cookie('sessionId', String(sessionId)).send({ msg: 'success' })
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
