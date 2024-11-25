const db = require('../db/index')
const fs = require('fs')
const path = require('path')

const setProductImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3008/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      detail_img: item.detail_img ? serverAddress + '/' + item.detail_img.replace(/\\/g, '/') : serverAddress + '/images/default_image.jpg'
    };
  });

  return resultWithImageUrl
}


// 获取商品信息
exports.getGoods = (req, res) => {
  const sql = `SELECT product_id, product_name FROM products;`
  db.query(sql, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }
    if (results.length === 0) {
      return res.send({
          status: 200,
          message: '还没有商品数据',
          data: results,
      })
    }

    return res.send({
      status: 200,
      message: '获取商品数据成功',
      data: results
    })
  })
}

// 根据商品表查询商品详情表中的数据
exports.getGoodsDetail = (req, res) => {
  const { product_id } = req.body

  const sql = `SELECT *
                FROM product_detail
              WHERE product_id = ?;`

  db.query(sql, product_id, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }
    if (results.length === 0) {
      return res.send({
          status: 200,
          message: '还没有商品详情数据',
          data: setProductImg(results),
      })
    }

    return res.send({
      status: 200,
      message: '获取商品详情数据成功',
      data: setProductImg(results)
    })
  })
}

const delDetailImg = (selResults) => {
  if (selResults.length > 0) {
    selResults.forEach(result => {
      const oldAvatarPath = result.detail_img
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
    })
  }
}

// 删除商品详情表中指定的数据
exports.delGoodsDetail = (req, res) => {
  const { detail_id } = req.body

  const selSql = "SELECT detail_img FROM product_detail WHERE detail_id = ?"
  db.query(selSql, detail_id, (selErr, selResults) => {
    if (selErr) {
      return res.retMsg(selErr)
    }

    delDetailImg(selResults)

    const sql = `DELETE FROM product_detail WHERE detail_id = ?;`

    db.query(sql, detail_id, (err, results) => {
      if (err) {
        return res.retMsg(err)
      }
      if (results.affectedRows === 0) {
        return res.retMsg('商品详情轮播图删除失败')
      }

      res.send({
        status: 200,
        message: '商品详情轮播图删除成功'
      })
    })
  })
}

// 编辑/添加商品详情表中指定的数据
exports.setAndAddGoodsDetail = (req, res) => {
  let { detail_id, product_id, detail_time } = req.body
  let detail_img = req.file ? req.file.path : undefined

  detail_id = parseInt(detail_id);
  product_id = parseInt(product_id);
  // 将 detail_time 转换为时间戳类型
  detail_time = new Date(detail_time);

  // detail_id存在执行的就是修改操作，不存在执行的是添加操作
  if (detail_id) {
    let sql = ''
    let values = []
    if (detail_img !== undefined) {
      values = [detail_img, detail_time, detail_id]
      sql = `UPDATE product_detail
              SET detail_img = ?,
                  detail_time = ?
              WHERE detail_id = ?;`

      const selSql = "SELECT detail_img FROM product_detail WHERE detail_id = ?"
      db.query(selSql, detail_id, (selErr, selResults) => {
        if (selErr) {
          return res.retMsg(selErr)
        }
        delDetailImg(selResults)

        db.query(sql, values, (err, results) => {
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
      values = [detail_time, detail_id]
      sql = `UPDATE product_detail
              SET detail_time = ?
            WHERE detail_id = ?;`

      db.query(sql, values, (err, results) => {
        if (err) {
          return res.retMsg(err)
        }

        if (results.affectedRows !== 1) {
          return res.retMsg('详情图片更新失败')
        }

        res.send({
          status: 200,
          message: '详情图片更新失败'
        })
      })
    }
  } else {
    if (!detail_img) {
      detail_img = 'images/default_image.jpg'
    }

    const sql = `INSERT INTO product_detail (detail_img, product_id) VALUES (?, ?);`

    db.query(sql, [detail_img, product_id], (err, results) => {
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