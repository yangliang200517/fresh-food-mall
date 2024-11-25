const db = require('../db/index')
const bcrypt = require('bcryptjs')   //用于密码加密
const jwt = require('jsonwebtoken')  //用于生成token
const config = require('../config')

// 注册
exports.regUser = (req, res) => {
  const userinfo = req.body
  console.log(req.body)

  const sqlStr = 'SELECT * FROM admin_user WHERE name = ?;'
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }
    if (results.length > 0) {
      return res.retMsg('用户名被占用，请重新输入')
    }
    // 给密码加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    const insertSql = 'INSERT INTO admin_user SET ?;'
    db.query(insertSql, {name: userinfo.username, password: userinfo.password, grade: 0}, (err, results) => {
      if (err) return res.retMsg(err)
      if (results.affectedRows !== 1) {
        return res.retMsg('注册失败，请稍后再试！！')
      }

      res.retMsg('注册成功,请登录', 200)
    })
  })
}

// 登录
exports.login = (req, res) => {
  const userinfo = req.body
  const expiresIn = '3h'        // 1m就是1分钟 1h就是一小时
  console.log(userinfo);

  const loginSql = 'SELECT * FROM admin_user WHERE name = ?;'

  db.query(loginSql, userinfo.username, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }

    if (results.length !== 1) {
      return res.retMsg('登陆失败，请先注册')
    }

    // 用户名正确，就判断密码
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!compareResult) {
      return res.retMsg('密码错误，请重新输入')
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