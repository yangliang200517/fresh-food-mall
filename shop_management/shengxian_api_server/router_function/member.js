const db = require('../db/index')
const bcrypt = require('bcryptjs')

const setProductImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3008/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      user_pic: item.user_pic ? serverAddress + '/' + item.user_pic.replace(/\\/g, '/') : serverAddress + '/images/default_image.jpg'
    };
  });

  return resultWithImageUrl
}

// 获取管理员信息
exports.getMember= (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      user_pic,
      full_name,
      sex,
      age,
      grade,
      email,
      admin_time
    FROM admin_user
  `
  db.query(sql, (err, results) => {
    if (err) {
        return res.retMsg(err)
    }
    if (results.length === 0) {
      return res.send({
          status: 200,
          message: '还没有管理员数据',
          data: results,
      })
    }

    return res.send({
      status: 200,
      message: '获取管理员数据成功',
      data: setProductImg(results)
    })
  })
}

// 修改管理员等级
exports.setMemberGrade= (req, res) => {
  const { id, grade } = req.body
  const sql = `UPDATE admin_user SET grade = ? WHERE id = ?`

  db.query(sql, [grade, id], (err, results) => {
    if (err) {
      return res.retMsg(err)
    }

    if (results.affectedRows !== 1) {
      return res.retMsg('等级修改失败')
    }

    res.retMsg('等级修改成功', 200)
  })
}

// 删除管理员
exports.delMember = (req, res) => {
  const { id } = req.body
  const sql = `DELETE FROM admin_user WHERE id = ?`

  db.query(sql, id, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }

    if (results.affectedRows === 0) {
      return res.retMsg('管理员删除失败')
    }

    res.send({
      status: 200,
      message: '管理员商品成功'
    })
  })
}

// 添加管理员
exports.addMember = (req, res) => {
  const { name, password, sex, age, grade, email } = req.body

  const insertSql = `INSERT INTO
                      admin_user
                      SET name = ?,
                        password = ?,
                        sex = ?,
                        age = ?,
                        grade = ?,
                        email = ?;`

  // 给密码加密
  const hashedPassword  = bcrypt.hashSync(password, 10)

  db.query(insertSql, [name, hashedPassword, sex, age, grade, email], (err, results) => {
    if (err) return res.retMsg(err)
    if (results.affectedRows !== 1) {
      return res.retMsg('添加失败，请稍后再试！！')
    }

    res.retMsg('管理员添加成功', 200)
  })
}