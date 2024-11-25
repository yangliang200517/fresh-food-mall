const db = require('../db/index')
const fs = require('fs')
const path = require('path')

// 获取分类
exports.getArticle = (req, res) => {
  const getFenleiSql = `SELECT * FROM categories`

  db.query(getFenleiSql, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }
    if (results.length === 0) {
      return res.retMsg('获取分类信息失败!')
    }

    res.send({
      status: 200,
      message: '获取分类信息成功',
      data: results,
    })
  })
}

// 添加分类
exports.addArticle = (req, res) => {
  const { category_name } = req.body

  const selArticleName = `SELECT * FROM categories WHERE category_name = ?;`
  db.query(selArticleName, category_name, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }
    if (results.length !== 0) {
      return res.retMsg('已有该分类名称，请重新输入!')
    }

    const insertArticleName = `INSERT INTO categories SET category_name = ?;`

    db.query(insertArticleName, category_name, (insErr, insResults) => {
      if (insErr) return res.retMsg(insErr)
      if (insResults.affectedRows !== 1) {
        return res.retMsg('添加分类失败！')
      }

      res.send({
        status: 200,
        message: '添加分类成功',
        data: insResults,
      })
    })
  })
}

// 修改分类
exports.changeArticle = (req, res) => {
  const { category_id, category_name,  } = req.body

  const selArticleName = `SELECT * FROM categories WHERE category_name = ?;`
  db.query(selArticleName,  category_name, (err, results) => {
    if (err) {
      return res.retMsg(err)
    }
    if (results.length !== 0) {
      return res.retMsg('该分类名称已存在，请重新输入!')
    }

    const updArticleName = `UPDATE categories SET category_name = ? WHERE category_id = ?;`
    db.query(updArticleName, [category_name, category_id], (updErr, updResults) => {
      if (updErr) {
        return res.retMsg(updErr)
      }

      if (updResults.affectedRows !== 1) {
        return res.retMsg('修改分类失败')
      }

      res.send({
        status: 200,
        message: '修改分类成功'
      })
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

// 删除分类
/*
这里依次删除表中的数据是因为这些表中都引用了products表中的product_id字段，在删除 products 表中
的数据时也会触发外键约束。你需要先删除引用了 products 表的 product_id 字段的表中的数据，然后才
能删除 products 表中的数据
*/

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

exports.deleteArticle = (req, res) => {
  const { category_id  } = req.body

  // 删除该分类商品的订单
  const delOrderPro = `DELETE FROM order_details
  WHERE product_id IN (SELECT product_id FROM products WHERE category_id = ?);`

  db.query(delOrderPro, category_id, (orderErr, orderResults) => {
    if (orderErr) {
      return res.retMsg(orderErr)
    }
    console.log("aaa");
    // 删除该分类下的商品的评论
    const delProductsComment = `DELETE FROM reviews
    WHERE product_id IN (SELECT product_id FROM products WHERE category_id = ?);`

    db.query(delProductsComment, category_id, (err, results) => {
      if (err) {
        return res.retMsg(err)
      }
      console.log("BBB");
      // 再删除购物车中的商品
      const delCartProducts = `DELETE FROM carts
      WHERE product_id IN (SELECT product_id FROM products WHERE category_id = ?);`

      db.query(delCartProducts, category_id, (cartErr, cartResults) => {
        if (cartErr) {
          return res.retMsg(cartErr)
        }
        console.log("CCC");

        // 删除商品详情图片
        const selDetailSql = `SELECT detail_img FROM product_detail WHERE product_id IN (SELECT product_id FROM products WHERE category_id = ?);`
        db.query(selDetailSql, category_id, (selErr, selResults) => {
          if (selErr) {
            return res.retMsg(selErr)
          }

          delDetailImg(selResults)

          // 删除商品详情
          const delProductDetail = `DELETE FROM product_detail WHERE product_id IN (SELECT product_id FROM products WHERE category_id = ?);`
          db.query(delProductDetail, category_id, (delDelErr, delDelResults) => {
            if (delDelErr) {
              return res.retMsg(delDelErr)
            }

            // 删除指定商品图片
            const selProductSql = `SELECT product_pic FROM products WHERE product_id IN (SELECT product_id FROM products WHERE category_id = ?);`
            db.query(selProductSql, category_id, (selErr, selResults) => {
              if (selErr) {
                return res.retMsg(selErr)
              }
              delProductImg(selResults)

               // 再删除指定商品
              const delArticleProducts = `DELETE FROM products WHERE category_id = ?;`

              db.query(delArticleProducts, category_id, (delProErr, delProResults) => {
                if (delProErr) {
                  return res.retMsg(delProErr)
                }
                console.log("DDD");
                // 最后删除指定分类
                const delArticle = `DELETE FROM categories WHERE category_id = ?;`
                db.query(delArticle, category_id, (delArtErr, delArtResults) => {
                  if (delArtErr) {
                    return res.retMsg(delArtErr)
                  }
                  if (delArtResults.affectedRows === 0) {
                    return res.retMsg('分类删除失败')
                  }
                  console.log("EEE");
                  res.send({
                    status: 200,
                    message: '删除分类成功'
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}