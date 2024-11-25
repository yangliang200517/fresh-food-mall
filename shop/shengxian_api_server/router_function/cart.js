const db = require('../db/index')

// 转图片
const setProductImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3008/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      product_pic: item.product_pic ? serverAddress + '/' + item.product_pic.replace(/\\/g, '/') : serverAddress + '/images/default_image.jpg'
    };
  });

  return resultWithImageUrl
}


// 添加商品到购物车
exports.addCartGoods = (req, res) => {
  console.log(req.body)

  const { productId, userId, quantity } = req.body;

  const selectCartGoods = "SELECT * FROM carts WHERE product_id = ? AND user_id = ?;"

  db.query(selectCartGoods, [productId, userId], (err, results) => {
    if (err) {
      return res.cc(err)
    }

    const addCountSql = 'UPDATE carts SET quantity = quantity + ? WHERE product_id = ? AND user_id = ?;'
    if (results.length > 0) {
      db.query(addCountSql, [quantity, productId, userId], (countErr, countResults) => {
        if (countErr) {
          return res.cc(countErr)
        }

        if (countResults.affectedRows !== 1) {
          return res.cc('添加数量失败')
        }

        const cartCountSql = 'SELECT * FROM carts WHERE user_id = ?;'
        db.query(cartCountSql, userId, (cartErr, cartResults) => {
          if (cartErr) {
            return res.cc(cartErr)
          }

          if (cartResults.length === 0) {
            return res.cc('购物车数量查询失败')
          }

          return res.send({
            status: 200,
            message: '添加数量成功',
            cartLength: cartResults.length
          })
        })
      })
    } else if (results.length === 0) {
      const InserGoodsSql = 'INSERT INTO carts set ?;'
      db.query(InserGoodsSql, {user_id: userId, product_id: productId, quantity: quantity}, (goodsErr, goodsResults) => {

        if (goodsErr) {
          return res.cc(goodsErr)
        }

        if (goodsResults.affectedRows !== 1) {
          return res.cc('添加购物车失败')
        }

        const cartCountSql = 'SELECT * FROM carts WHERE user_id = ?;'
        db.query(cartCountSql, userId, (cartErr, cartResults) => {

          if (cartErr) {
            return res.cc(cartErr)
          }
          if (cartResults.length === 0) {
            return res.cc('购物车数量查询失败')
          }

          res.send({
            status: 200,
            message: '添加购物车成功',
            cartLength: cartResults.length
          })
        })
      })
    }
  })
}

// 获取购物车商品列表
exports.getCartList = (req, res) => {
  console.log(req.body);
  const sql = `SELECT
    products.product_id,
    products.stock,
    carts.cart_id,
    products.description,
    products.price,
    products.product_pic,
    carts.quantity
    FROM products JOIN carts ON products.product_id = carts.product_id WHERE carts.user_id = ?;`
  db.query(sql, [req.body.userId], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.send({
        status: 200,
        message: '购物车列表为空',
        cartList: results
      })
    }

    res.send({
      status: 200,
      message: '购物车列表获取成功',
      cartList: setProductImg(results)
    })
  })
}

// 更新购物车商品列表
exports.updateCartList = (req, res) => {
  const { cartId, productId, quantity } = req.body

  const selectCartSql = 'UPDATE carts SET quantity = ? WHERE cart_id = ? AND product_id = ?;'
  db.query(selectCartSql, [quantity, cartId, productId], (err, results) => {
    if  (err) {
      return res.cc(err)
    }

    if (results.affectedRows !== 1) {
      return res.cc('购物车商品更新失败')
    }

    res.send({
      status: 200,
      message: '购物车商品更新成功'
    })
  })
}

// 删除购物车商品
exports.deleteCartList = (req, res) => {
  const { cartId } = req.body
  const deleteCartSql = 'DELETE FROM carts WHERE cart_id IN (?);'
  // 使用循环动态添加条件

  db.query(deleteCartSql, [cartId], (err, results) => {
    if  (err) {
      return res.cc(err)
    }

    if (results.affectedRows < 1) {
      return res.cc('购物车商品删除失败')
    }

    res.send({
      status: 200,
      message: '购物车商品删除成功'
    })
  })
}