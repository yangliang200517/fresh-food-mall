const db = require('../db/index')
const fs = require('fs')
const path = require('path')

const setProductImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3008/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      carousel_pic: serverAddress + '/' + item.carousel_pic.replace(/\\/g, '/') // 使用正斜杠替换反斜杠
    };
  });

  return resultWithImageUrl
}

// 获取轮播图
exports.getCarousel = (req, res) => {
  const sql = `SELECT * FROM carousel`

  db.query(sql, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }
    if (results.length === 0) {
      return res.send({
        status: 200,
        message: '没有轮播图数据',
        data: results,
      })
    }

    res.send({
      status: 200,
      message: '获取轮播图数据成功',
      data: setProductImg(results),
    })
  })
}

// 添加或修改轮播图
exports.setOrAddCarousel = (req, res) => {
  const { id, carousel_time } = req.body
  let carousel_pic = req.file ? req.file.path : undefined
  let params = [carousel_time, id];

  console.log(carousel_pic);

  // id存在执行的就是修改操作，不存在执行的是添加操作
  if (id) {
    let sql

    if (carousel_pic !== undefined) {
      params.unshift(carousel_pic);

      sql = `UPDATE carousel
                SET carousel_pic = ?,
                carousel_time = ?
                WHERE id = ?;`

      const selSql = `SELECT carousel_pic FROM carousel WHERE id = ?;`
      db.query(selSql, id, (selErr, selResults) => {
        if (selErr) {
          return res.retMsg(selErr)
        }
        if (selResults.length !== 1) {
          return res.retMsg('没旧头像')
        }

        if (selResults.length > 0) {
          const oldAvatarPath = selResults[0].carousel_pic
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

        db.query(sql, params, (err, results) => {
          if (err) {
            return res.retMsg(err)
          }

          if (results.affectedRows !== 1) {
            return res.retMsg('轮播图更新失败')
          }

          res.send({
            status: 200,
            message: '轮播图更新成功'
          })
        })
      })

    } else {
      if (params.includes(carousel_pic)) {
        // 从params数组中删除product_pic
        params.splice(params.indexOf(carousel_pic), 1);
      }

      sql = `UPDATE carousel SET carousel_time = ? WHERE id = ?;`

      db.query(sql, params, (err, results) => {
        if (err) {
          return res.retMsg(err)
        }

        if (results.affectedRows !== 1) {
          return res.retMsg('轮播图更新失败')
        }

        res.send({
          status: 200,
          message: '轮播图更新成功'
        })
      })
    }
  } else {
    if (!carousel_pic) {
      carousel_pic = 'images/default_image.jpg'
    }

    const sql = `INSERT INTO carousel (carousel_pic) VALUES (?);`

    db.query(sql, carousel_pic, (err, results) => {
      if (err) return res.retMsg(err)
      if (results.affectedRows !== 1) {
        return res.retMsg('插入失败')
      }

      res.send({
        status: 200,
        message: '完成',
      })
    })
  }
}

// 删除轮播图
exports.deleteCarousel = (req, res) => {
  const { id } = req.body

  const selSql = `SELECT carousel_pic FROM carousel WHERE id = ?;`
  db.query(selSql, id, (selErr, selResults) => {
    if (selErr) {
      return res.retMsg(selErr)
    }

    if (selResults.length > 0) {
      const oldAvatarPath = selResults[0].carousel_pic
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

    const sql = `DELETE FROM carousel WHERE id = ?;`
    db.query(sql, id, (err, results) => {
      if (err) {
        return res.retMsg(err)
      }

      if (results.affectedRows === 0) {
        return res.retMsg('轮播图删除失败')
      }

      res.send({
        status: 200,
        message: '轮播图删除成功'
      })
    })
  })
}