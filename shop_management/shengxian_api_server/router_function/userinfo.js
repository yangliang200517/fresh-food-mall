const db = require('../db/index')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const setProductImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3009/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      // 使用正斜杠替换反斜杠
      user_pic: item.user_pic ? serverAddress + '/' + item.user_pic.replace(/\\/g, '/') : serverAddress + '/images/default_image.jpg'
    };
  });

  return resultWithImageUrl
}

// 获取管理员信息
exports.getuserInfo = (req, res) => {
  const getUserDataSql = `SELECT
    id,
    name,
    sex,
    age,
    full_name,
    user_pic,
    grade
    FROM admin_user WHERE id = ?;`

  db.query(getUserDataSql, req.user.id, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }

    if (results.length !== 1) {
      return res.retMsg('获取用户信息失败!')
    }

    res.send({
      status: 200,
      message: '获取用户信息成功',
      data: setProductImg(results)[0],
    })
  })
}

// 修改管理员信息
exports.updateUserInfo = (req, res) => {
  const { age, full_name, grade, name, sex, id} = req.body
  const updateUserInfoSql = `
  UPDATE
    admin_user
  SET name = ?,
    sex = ?,
    age = ?,
    full_name = ?,
    grade = ?
  WHERE id = ?
  `

  db.query(updateUserInfoSql, [name, sex, age, full_name, grade, id], (err, results) => {
      if (err) {
        return res.retMsg(err)
      }

      if (results.affectedRows !== 1) {
        return res.retMsg('修改用户信息失败')
      }

      return res.retMsg('修改用户信息成功', 200)
  })
}

// 修改管理员密码
exports.updateUserPassword = (req, res) => {
  const updatePassword = 'SELECT * FROM admin_user WHERE id = ?'

  db.query(updatePassword, req.user.id, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }

    if (results.length !== 1) {
      return res.retMsg('用户不存在')
    }

    // 判断用户输入的旧密码是否正确
    const comperpwd = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!comperpwd) {
      return res.retMsg('旧密码输入错误')
    }

    // 对新密码加密再添加到数据库中
    const insertNewPwd = 'UPDATE admin_user SET password = ? WHERE id = ?'
    const userNewPwd = bcrypt.hashSync(req.body.newPwd, 10)

    db.query(insertNewPwd, [userNewPwd, req.user.id], (errPwd, resultsPwd) => {
      if (errPwd) {
        return res.retMsg(errPwd)
      }

      if (resultsPwd.affectedRows !== 1) {
        return res.retMsg('密码修改失败')
      }

      res.retMsg('密码修改成功', 200)
    })
  })
}

// 修改管理员头像
exports.updateAvater = (req, res) => {
  let user_pic = req.file ? req.file.path : undefined

  const selSql = "SELECT user_pic FROM admin_user WHERE id = ?"
  db.query(selSql, req.user.id, (selErr, selResults) => {
    if (selErr) {
      return res.retMsg(selErr)
    }

    if (selResults.length !== 1) {
      return res.retMsg('旧头像删除失败')
    }

    if (selResults.length > 0) {
      const oldAvatarPath = selResults[0].user_pic
      if (oldAvatarPath) {
        // 删除之前的头像文件
        const filePath = path.join(__dirname, '..', oldAvatarPath)
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('旧头像删除失败:', err)
          } else {
            console.log('旧头像删除成功')
          }
        })
      }
    }

    const sql = "UPDATE admin_user SET user_pic = ? WHERE id = ?"
    db.query(sql, [user_pic, req.user.id], (err, results) => {
      if (err) {
        return res.retMsg(err)
      }

      if (results.affectedRows !== 1) {
        return res.retMsg('头像更新失败')
      }

      return res.retMsg('头像更新成功', 200)
    })
  })
}

// 获取管理员头像
exports.getAvater = (req, res) => {
  const sql = `SELECT
    id,
    user_pic
    FROM admin_user WHERE id = ?;`

  db.query(sql, req.user.id, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }

    if (results.length !== 1) {
      return res.retMsg('获取管理员头像失败!')
    }

    res.send({
      status: 200,
      message: '获取管理员头像成功',
      data: setProductImg(results),
    })
  })
}