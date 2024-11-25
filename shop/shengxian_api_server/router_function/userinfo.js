const db = require('../db/index')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const setProductImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3007/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      // 使用正斜杠替换反斜杠
      user_pic: item.user_pic ? serverAddress + '/' + item.user_pic.replace(/\\/g, '/') : serverAddress + '/images/1.png'
    };
  });

  return resultWithImageUrl
}


// 获取用户信息
exports.getuserInfo = (req, res) => {
  console.log(req.user.user_id);
  const getUserDataSql = `SELECT
    user_id,
    name,
    sex,
    age,
    full_name,
    email,
    user_pic
    FROM users WHERE user_id = ?;`

  db.query(getUserDataSql, [req.user.user_id], (err, results) => {
    if (err) {
      return res.cc(err)
    }

    if (results.length !== 1) {
      return res.cc('获取用户信息失败!')
    }

    res.send({
      status: 200,
      message: '获取用户信息成功',
      data: setProductImg(results)[0],
    })
  })
}

// 更新用户信息路由
exports.updateUserInfo = (req, res) => {
  const updateUserInfoSql = 'UPDATE users SET ? WHERE user_id = ?'

  db.query(updateUserInfoSql, [req.body, req.body.user_id], (err, results) => {
      if (err) {
        return res.cc(err)
      }

      if (results.affectedRows !== 1) {
        return res.cc('修改用户信息失败')
      }

      return res.cc('修改用户信息成功', 200)
  })
}

// 修改密码路由
exports.updateUserPassword = (req, res) => {
  const updatePassword = 'SELECT * FROM users WHERE user_id = ?'

  db.query(updatePassword, req.user.user_id, (err, results) => {
    if (err) {
      return res.cc(err)
    }

    if (results.length !== 1) {
      return res.cc('用户不存在')
    }
    // 判断用户输入的旧密码是否正确
    const comperpwd = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!comperpwd) {
      return res.cc('旧密码输入错误')
    }

    // 对新密码加密再添加到数据库中
    const insertNewPwd = 'UPDATE users SET password = ? WHERE user_id = ?'
    const userNewPwd = bcrypt.hashSync(req.body.newPwd, 10)

    db.query(insertNewPwd, [userNewPwd, req.user.user_id], (err, results) => {
      if (err) {
        return res.cc(err)
      }

      if (results.affectedRows !== 1) {
        return res.cc('密码修改失败')
      }

      res.cc('密码修改成功', 200)
    })
  })
}

// 修改头像路由
exports.updateAvater = (req, res) => {
  let user_pic = req.file ? req.file.path : undefined

  // 删除旧头像
  const getOldAvatarSql = `SELECT user_pic FROM users WHERE user_id = ?`
  db.query(getOldAvatarSql, req.user.user_id, (getErr, getResults) => {
    if (getErr) {
      return res.cc(getErr)
    }

    if (getResults.length !== 1) {
      return res.cc('查询用户头像失败！')
    }

    if (getResults.length > 0) {
      const oldAvatarPath = getResults[0].user_pic;
      if (oldAvatarPath) {
        // 删除之前的头像文件
        const filePath = path.join(__dirname, '..', oldAvatarPath);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('旧头像删除失败:', err);
          } else {
            console.log('旧头像删除成功');
          }
        });
      }
    }

    // 更新头像
    const sql = "UPDATE users SET user_pic = ? WHERE user_id = ?"
    db.query(sql, [user_pic, req.user.user_id], (err, results) => {
      if (err) {
        return res.cc(err)
      }

      if (results.affectedRows !== 1) {
        return res.cc('头像更新失败')
      }

      return res.cc('头像更新成功', 200)
    })
  })
}