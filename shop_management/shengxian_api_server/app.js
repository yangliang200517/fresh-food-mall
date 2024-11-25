const express = require('express')
// const multer = require('multer');
const cors = require('cors')
const joi = require('joi')
const config = require('./config')
const expressJWT = require('express-jwt')
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userinfo')
const fenleiRouter = require('./router/fenlei')
const goodsRouter = require('./router/goods')
const carouselRouter = require('./router/carousel')
const dataRouter = require('./router/data')
const consumerRouter = require('./router/consumer')
const memberRouter = require('./router/member')
const forgetpwdRouter = require('./router/forgetpwd')
const goodsdetailRouter = require('./router/goodsdetail')

const app = express()

app.use((req, res, next) => {
  res.retMsg = (err, status = 300) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

app.use(cors())
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({path:[/^\/api/]}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', userRouter,
                fenleiRouter,
                goodsRouter,
                carouselRouter,
                dataRouter,
                consumerRouter,
                memberRouter,
                forgetpwdRouter,
                goodsdetailRouter)
app.use('/api/images', express.static('images'))
app.use('/my', userInfoRouter)

app.use((err, req, res, next) => {
  // 验证失败的错误
  if (err instanceof joi.ValidationError) {
    return res.retMsg(err)
  }
  // 验证 Token 失败导致的错误
  if (err.name === 'UnauthorizedError') {
    console.error('Token 解析失败：', err.message)
    return res.retMsg('登陆过期，请重新登录！')
  }
  // 未知的错误
  res.retMsg(err)
})

app.listen(3009, () => {
  console.log("http://127.0.0.1:3009");
})