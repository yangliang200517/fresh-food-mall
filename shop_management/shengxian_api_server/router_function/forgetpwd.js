const db = require('../db/index')
const bcrypt = require('bcryptjs')

// 忘记密码
exports.forGetPassword = (req, res) => {
  const { email, password} = req.body
  const sql = `SELECT * FROM admin_user WHERE email = ?;`
  db.query(sql, email, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }

    if (results.length !== 1) {
      return res.retMsg('未找到用户，请确认邮箱地址是否正确')
    }

    // 给密码加密
    const hashedPassword  = bcrypt.hashSync(password, 10)

    const insertSql = 'UPDATE admin_user SET password = ? WHERE id = ?;'
    db.query(insertSql, [hashedPassword, results[0].id], (err, results) => {
      if (err) return res.retMsg(err)
      if (results.affectedRows !== 1) {
        return res.retMsg('密码修改失败，请稍后再试！！')
      }

      res.retMsg('密码修改成功, 请登录', 200)
    })
  })
}