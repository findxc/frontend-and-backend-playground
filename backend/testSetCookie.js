// 关于 set-cookie 的各种测试

const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')

const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('dev'))

const PORT = 3000

const originWhiteList = ['https://localhost:5000']

app.all('*', function (req, res, next) {
  // 不允许浏览器缓存请求结果，否则可能响应头变化后，前端是使用的缓存，没拿到最新的响应头
  res.header('Cache-Control', 'no-store')

  const originFind = originWhiteList.find(x => x === req.headers.origin)
  // 只允许白名单里面的域跨域访问
  if (originFind) {
    res.header('Access-Control-Allow-Origin', originFind)
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
  } else {
    res.send({ msg: 'success' })
  }
})

app.get('/cors', (req, res) => {
  console.log(req.headers.cookie)

  res.send({ msg: 'success' })
})

let sessionId = 1
app.post('/login', (req, res) => {
  console.log(req.headers.cookie)

  sessionId++

  res.cookie('sessionId', String(sessionId))

  // 配置了 httpOnly true ，则通过 document.cookie 获取不到
  res.cookie('httpOnly-xxx', String(sessionId), { httpOnly: true })

  // 以 __Secure 和 __Host 开头的 cookie 需要同时设置 secure true
  res.cookie('__Secure-xxx', String(sessionId), { secure: true })
  res.cookie('__Host-xxx', String(sessionId), { secure: true })

  // __Host 开头的 cookie 不能设置 domain ，否则是无效的
  res.cookie('__Host-not-work', String(sessionId), {
    secure: true,
    domain: 'localhost',
  })

  // 如果跨站了，要设置 sameSite none ，同时 secure true
  res.cookie('cross-site-xxx', String(sessionId), {
    sameSite: 'none',
    secure: true,
  })

  res.send({ msg: 'success' })
})

// 支持 http 访问的服务
http.createServer(app).listen(PORT)

const keyPath = path.resolve(__dirname, '../ssl-key.pem')
const certPath = path.resolve(__dirname, '../ssl-cert.pem')
// 如果有 ssl 证书，那么再启动一个支持 https 访问的服务
if (fs.existsSync(keyPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
  // 注意这里是 listen(PORT + 1) ，不能监听同一个端口
  https.createServer(options, app).listen(PORT + 1)
}
