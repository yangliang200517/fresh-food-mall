const db = require('../db/index')
const fs = require('fs')
const path = require('path')

const setProductImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3008/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      product_pic: serverAddress + '/' + item.product_pic.replace(/\\/g, '/') // 使用正斜杠替换反斜杠
    };
  });

  return resultWithImageUrl
}

// 获取商品
exports.getProduct = (req, res) => {
  const page = parseInt(req.body.page) || 1
  const pageSize = parseInt(req.body.pageSize) || 4
  const selValue  = req.body.selValue
  const offset = (page - 1) * pageSize

  const getGoodsSql = `SELECT COUNT(*) AS totalCount FROM products`

  if (!selValue) {
    db.query(getGoodsSql, (err, results) => {
      if (err) {
        return res.retMsg(err)
      }
      if (results.length === 0) {
        return res.send({
          status: 200,
          message: '还没有生鲜商品',
          data: results,
        })
      }
      const totalCount = results[0].totalCount
      const pageProduct = `SELECT * FROM products AS p JOIN categories AS c ON p.category_id = c.category_id LIMIT ?, ?;`

      db.query(pageProduct, [offset, pageSize], (pageErr, pageResult) => {
        if (pageErr) {
          return res.retMsg(pageErr)
        }
        if (pageResult.length === 0) {
          return res.send({
            status: 200,
            message: '还没有生鲜商品',
            data: pageResult,
          })
        }

        res.send({
          status: 200,
          message: '获取生鲜商品信息成功',
          data: setProductImg(pageResult),
          total: totalCount
        })
      })
    })
  } else {
    const getIdGoodsSql = `SELECT COUNT(*) AS totalCount FROM products WHERE category_id = ?`
    db.query(getIdGoodsSql, [selValue], (err, results) => {
      if (err) {
        return res.retMsg(err)
      }
      if (results.length === 0) {
        return res.send({
          status: 200,
          message: '还没有生鲜商品',
          data: results,
        })
      }
      const totalCount = results[0].totalCount
      const pageProduct = `SELECT * FROM products AS p
      JOIN categories AS c
      ON p.category_id = c.category_id
      WHERE c.category_id = ? AND p.category_id = c.category_id LIMIT ?, ?;`

      db.query(pageProduct, [selValue, offset, pageSize], (pageErr, pageResult) => {
        if (pageErr) {
          return res.retMsg(pageErr)
        }
        if (pageResult.length === 0) {
          return res.send({
            status: 200,
            message: '还没有生鲜商品',
            data: pageResult,
          })
        }

        res.send({
          status: 200,
          message: '获取生鲜商品信息成功',
          data: setProductImg(pageResult),
          total: totalCount
        })
      })
    })
  }
}

// 修改和添加商品
exports.setOrAddProduct = (req, res) => {
  const {
    category_id,
    description,
    old_price,
    price,
    product_id,
    product_name,
    stock} = req.body

    let product_pic = req.file ? req.file.path : undefined
    let params = [product_name, description, price, old_price, stock, category_id, product_id];

    // id存在执行的就是修改操作，不存在执行的是添加操作
    if (product_id) {
      let sql;

      if (product_pic !== undefined) {
        params.unshift(product_pic);

        sql = `UPDATE products
                  SET product_pic = ?,
                  product_name = ?,
                  description = ?,
                  price = ?,
                  old_price = ?,
                  stock = ?,
                  category_id = ?
                  WHERE product_id = ?;`

        const selSql = `SELECT product_pic FROM products WHERE product_id = ?;`
        db.query(selSql, product_id, (selErr, selResults) => {
          if (selErr) {
            return res.retMsg(selErr)
          }
          if (selResults.length !== 1) {
            return res.retMsg('没旧头像')
          }

          if (selResults.length > 0) {
            const oldAvatarPath = selResults[0].product_pic
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
              return res.retMsg('商品信息更新失败')
            }

            res.send({
              status: 200,
              message: '商品信息更新成功'
            })
          })
        })
      } else {
        if (params.includes(product_pic)) {
          // 从params数组中删除product_pic
          params.splice(params.indexOf(product_pic), 1);
        }

        sql = `UPDATE products
                  SET product_name = ?,
                  description = ?,
                  price = ?,
                  old_price = ?,
                  stock = ?,
                  category_id = ?
                  WHERE product_id = ?;`

        db.query(sql, params, (err, results) => {
          if (err) {
            return res.retMsg(err)
          }

          if (results.affectedRows !== 1) {
            return res.retMsg('商品信息更新失败')
          }

          res.send({
            status: 200,
            message: '商品信息更新成功'
          })
        })
      }
    } else {
      if (!product_pic) {
        product_pic = 'images/default_image.jpg'
      }

      const sql = `INSERT INTO products
      (product_pic, product_name, description, price, old_price, stock, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`

      db.query(sql, [product_pic, product_name, description, price, old_price, stock, category_id], (err, results) => {
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

const delProductImg = (selResults) => {
  if (selResults.length > 0) {
    selResults.forEach(result => {
      const oldAvatarPath = result.product_pic
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

// 删除商品
exports.deleteProduct = (req, res) => {
  const { product_id } = req.body

  // 删除该商品的订单
  const delOrderPro = `DELETE FROM order_details
  WHERE product_id IN (SELECT product_id FROM products WHERE product_id = ?);`

  db.query(delOrderPro, product_id, (orderErr, orderResults) => {
    if (orderErr) {
      return res.retMsg(orderErr)
    }

    // 删除该分类下的商品的评论
    const delProductsComment = `DELETE FROM reviews
    WHERE product_id IN (SELECT product_id FROM products WHERE product_id = ?);`

    db.query(delProductsComment, product_id, (err, results) => {
      if (err) {
        return res.retMsg(err)
      }

      // 再删除购物车中的商品
      const delCartProducts = `DELETE FROM carts
      WHERE product_id IN (SELECT product_id FROM products WHERE product_id = ?);`

      db.query(delCartProducts, product_id, (cartErr, cartResults) => {
        if (cartErr) {
          return res.retMsg(cartErr)
        }

        const selDetailSql = `SELECT detail_img FROM product_detail WHERE product_id = ?;`
        db.query(selDetailSql, product_id, (selErr, selResults) => {
          if (selErr) {
            return res.retMsg(selErr)
          }

          delDetailImg(selResults)

          // 删除商品详情图片
          const delProductsDetail = `DELETE FROM product_detail WHERE product_id = ?;`
          db.query(delProductsDetail, product_id, (delDetalErr, delDetalResults) => {
            if (delDetalErr) {
              return res.retMsg(delDetalErr)
            }

            const selProductSql = `SELECT product_pic FROM products WHERE product_id = ?;`
            db.query(selProductSql, product_id, (selErr, selResults) => {
              if (selErr) {
                return res.retMsg(selErr)
              }
              if (selResults.length !== 1) {
                return res.retMsg('没旧头像')
              }
              delProductImg(selResults)

              // 再删除指定商品
              const delArticleProducts = `DELETE FROM products WHERE product_id = ?;`

              db.query(delArticleProducts, product_id, (delProErr, delProResults) => {
                if (delProErr) {
                  return res.retMsg(delProErr)
                }

                if (delProResults.affectedRows === 0) {
                  return res.retMsg('商品删除失败')
                }

                res.send({
                  status: 200,
                  message: '删除商品成功'
                })
              })
            })
          })
        })
      })
    })
  })
}

// 获取指定商品的评价数据
exports.getProductRviewsData = (req, res) => {
  const { product_id } = req.body
  const sql = `
  SELECT
    COUNT(CASE WHEN r.rating = 5 THEN 1 END) AS good_reviews_count,
    COUNT(CASE WHEN r.rating > 2 AND r.rating < 5 THEN 1 END) AS medium_reviews_count,
    COUNT(CASE WHEN r.rating < 3 THEN 1 END) AS bad_reviews_count,
    COUNT(*) AS total_reviews_count,
    ROUND((COUNT(CASE WHEN r.rating = 5 THEN 1 END) / COUNT(*)) * 100, 2) AS good_reviews_percentage,
    ROUND((COUNT(CASE WHEN r.rating > 2 AND r.rating < 5 THEN 1 END) / COUNT(*)) * 100, 2) AS medium_reviews_percentage,
    ROUND((COUNT(CASE WHEN r.rating < 3 THEN 1 END) / COUNT(*)) * 100, 2) AS bad_reviews_percentage
  FROM
    products p
  INNER JOIN
    reviews r ON p.product_id = r.product_id
  WHERE
    p.product_id = ?;
  `

  db.query(sql, product_id, (err, results) => {
    const responseData = [];

    if (err) {
      return res.retMsg(err)
    }
    if (results.length === 0) {
      return res.send({
        status: 200,
        message: '该商品还没有评价数据',
        data: results,
      })
    }

    results.forEach(row => {
      responseData.push(
        {
          value: row.good_reviews_count,
          name: '好评',
          good_reviews_percentage: row.good_reviews_percentage,
          count: row.total_reviews_count
        },
        {
          value: row.medium_reviews_count,
          name: '中评',
          medium_reviews_percentage: row.medium_reviews_percentage,
          count: row.total_reviews_count
        },
        { value: row.bad_reviews_count,
          name: '差评',
          bad_reviews_percentage: row.bad_reviews_percentage,
          count: row.total_reviews_count
        }
      );
    });

    res.send({
      status: 200,
      message: '商品评价信息获取成功',
      data: responseData
    })
  })
}