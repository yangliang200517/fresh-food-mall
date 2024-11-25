const db = require('../db/index')
const bcrypt = require('bcryptjs')   //用于密码加密
const jwt = require('jsonwebtoken')  //用于生成token
const config = require('../config')

// 注册
exports.regUser = (req, res) => {
  const userinfo = req.body
  console.log(userinfo);

  const sqlStr = 'select * from users where name = ?'
  db.query(sqlStr, userinfo.name, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length > 0) {
      return res.cc('用户名被占用，请重新输入')
    }
    // 给密码加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    const insertSql = 'insert into users set ?'
    db.query(insertSql, {name: userinfo.name, password: userinfo.password}, (err, results) => {

      if (err) return res.send({ status: 300, message: err.message })
      if (results.affectedRows !== 1) {
        return res.cc('注册失败，请稍后再试！！')
      }

      res.cc('注册成功,请登录', 200)
    })
  })
}


// 登录
exports.login = (req, res) => {
  const userinfo = req.body
  const expiresIn = '3h'        // 1m就是1分钟 1h就是一小时
  console.log(userinfo);

  const loginSql = 'SELECT * from users WHERE name = ?'

  db.query(loginSql, userinfo.name, (err, results) => {
    if (err) {
      return res.cc(err)
    }

    if (results.length !== 1) {
      return res.cc('登陆失败，请先注册')
    }
    // 用户名正确，就判断密码
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!compareResult) {
      return res.cc('密码错误，请重新输入')
    }
    // 生成token 返回给客户端
    const user = {...results[0], password: '', user_pic: ''}
    // 对用户数据进行加密，生成token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn })
    // 首先获取当前时间（以毫秒为单位），然后加上3小时的毫秒数
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

    res.send({
      status: 200,
      message: '登陆成功',
      token: 'Bearer ' + tokenStr,
      tokenExpiresAt: expiresAt
    })
  })
}