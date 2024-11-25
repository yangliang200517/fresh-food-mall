const express = require('express')
const cors = require('cors')    //解决前后端跨域问题
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userinfo')
const homeGoods = require('./router/home')
const cart = require('./router/cart')
const fenlei = require('./router/fenlei')
const comment = require('./router/comment')
const search = require('./router/search')
const address = require('./router/address')
const orders = require('./router/order')
const joi = require('joi')
const config = require('./config')
const expressJWT = require('express-jwt')

const app = express()

// 一定要在路由之前设置全局中间件，不然路由访问不到
app.use((req, res, next) => {
  res.cc = (err, status = 300) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})
app.use(cors())
// 一定要在路由之前配置解析 Token 的中间件 并排除哪些接口不需要认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({path:[/^\/api/]}))

/*
  * express.urlencoded是设置提交数据的格式，application/x-www-form-urlencoded
  * express.json()也是设置提交数据的格式， 这个设置的是json格式，因为axios提交的是json格式所以
  * 这里设置一下，如果想要用axios发送 application/x-www-form-urlencoded 格式的数据那就在前端的
  * axios请求之前设置一下请求头
*/
// app.use(express.urlencoded({extended: false}))

app.use(express.json())
app.use('/api', userRouter, homeGoods, cart, fenlei, comment, search, address, orders)
app.use('/api/images', express.static('images'))
app.use('/my', userInfoRouter)

// 在路由之后定义错误级别中间件
app.use((err, req, res, next) => {
  // 验证失败的错误
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }
  // 验证 Token 失败导致的错误
  if (err.name === 'UnauthorizedError') {
    console.error('Token 解析失败：', err.message)
    return res.cc('登陆过期，请重新登录！')
  }
  // 未知的错误
  res.cc(err)
})

app.listen(3007, () => {
  console.log('http://127.0.0.1:3007/')
})