const db = require('../db/index')
const func = require('./utils')

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

// 获取订单信息
exports.getOrders = (req, res) => {
  const { type, cartId, productId, quantity } = req.body

  // 从购物车购买
  if (type === 'cart') {
    const newCartId = cartId.split(',').map(Number)
    const CartItemSql = `SELECT
    products.product_name,
    products.product_id,
    products.product_pic,
    carts.cart_id,
    products.description,
    products.price,
    carts.quantity
    FROM products
    JOIN carts ON
    products.product_id = carts.product_id WHERE carts.cart_id IN (?);`
    db.query(CartItemSql, [newCartId], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.cc('订单信息查询失败')
      }

      //商品的数量
      const orderListCount = results.reduce((sum, item) => {
        return sum + item.quantity
      }, 0)

      // 商品的总价
      const orderListPrice = results.reduce((sum, item) => {
        return sum + item.quantity * item.price
      }, 0)

      return res.send({
        status: 200,
        orderList: setProductImg(results),
        orderListCount: orderListCount,
        orderListPrice: orderListPrice
      })
    })
  } else if (type === 'menu') {  // 从立即购买
    const sql = `SELECT
    products.product_name,
    products.product_id,
    products.product_pic,
    products.description,
    products.price
    FROM products
    WHERE product_id = ?;`

    db.query(sql, productId, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.cc('订单信息查询失败')
      }

      //商品的数量
      const orderListCount = results.reduce((sum, item) => {
        return Number(sum + quantity)
      }, 0)

      // 商品的总价
      const orderListPrice = results.reduce((sum, item) => {
        return sum + quantity * item.price
      }, 0)

      results.forEach(item => {
        item.quantity = quantity
      });

      return res.send({
        status: 200,
        orderList: setProductImg(results),
        orderListCount: orderListCount,
        orderListPrice: orderListPrice
      })
    })
  } else {
    return res.cc('购买失败')
  }
}

// 添加购买后的订单信息
exports.addPayOrders = (req, res) => {
  const { type, userId, cartId, productId, quantity } = req.body

  if (type === 'cart') {
    const newCartId = cartId.split(',').map(Number)
    const insertOrderDetailsQuery = `
      INSERT INTO order_details (user_id, product_id, quantity, product_status)
      SELECT ?, product_id, quantity, 1 FROM carts WHERE cart_id IN (${newCartId.map(() => '?').join(',')})
    `;

    db.query(insertOrderDetailsQuery, [userId, ...newCartId], (cartOrdererrs, cartOrderResults) => {
      if (cartOrdererrs) {
        return res.cc(cartOrdererrs)
      }
      if (cartOrderResults.affectedRows === 0) {
        return res.cc('购物车购买订单失败')
      }

      const subProductStockSql = `
      UPDATE products p
      JOIN carts c ON p.product_id = c.product_id
      SET p.stock = p.stock - c.quantity
      WHERE c.cart_id IN (${newCartId.map(() => '?').join(',')});
      `
      db.query(subProductStockSql, [...newCartId], (stockErr, stockResults) => {
        if (stockErr) {
          return res.cc(stockErr)
        }
        if (stockResults.affectedRows === 0) {
          return res.cc('购物车数量减少失败')
        }

        setTimeout(()  => {
          func.setProductStatus()
          .then(() => {
            console.log('订单状态更新完成');
            // 继续下一步操作...
          })
          .catch((error) => {
            console.error('更新订单状态出错:', error);
            // 错误处理...
          });
        }, 15000)

        return res.send({
          status: 200,
          message: '购物车购买订单成功',
          orderList: cartOrderResults
        })
      })
    })
  } else if (type === 'menu') {
    const sql = 'INSERT INTO order_details SET user_id = ?, product_id = ?, quantity = ?, product_status = ?;'

    db.query(sql, [userId, productId, quantity, 1], (menuErr, MenuResult) => {
      if (menuErr) {
        return res.cc(menuErr)
      }
      if (MenuResult.affectedRows === 0) {
        return res.cc('立即购买订单失败')
      }

      const subProductStockSql = `
        UPDATE products SET stock = stock - ? WHERE product_id = ?;
      `
      db.query(subProductStockSql, [quantity, productId], (stockErr, stockResults) => {
        if (stockErr) {
          return res.cc(stockErr)
        }
        if (stockResults.affectedRows === 0) {
          return res.cc('数量减少失败')
        }

        setTimeout(() => {
          func.setProductStatus()
          .then(() => {
            console.log('订单状态更新完成');
            // 继续下一步操作...
          })
          .catch((error) => {
            console.error('更新订单状态出错:', error);
            // 错误处理...
          });
        }, 15000)

        res.send({
          status: 200,
          message: '立即购买订单成功',
          orderList: MenuResult
        })
      })
    })
  }
}

// 查询订单信息
/*
  * 基本功能已经完成，但是还是有点缺点
  * 1. 都是死数据，把数据换成前端传递的值
  * 2. 查询还是有点问题，如果是购物车购买的话，应该查询购物车的相关数据，如果是立即购买的话，需要查询
  *    products商品表里的数据，所以还是需要判断type类型是cart还是menu
*/

// 获取购买后所有的订单商品
exports.getOrderItem = (req, res) => {
  const { userId, currentPage, pageSize } = req.body
  const offset = (currentPage - 1) * pageSize

   const getOrderDetailsQuery = `
    SELECT
      od.order_detail_id,
      od.user_id,
      od.product_id,
      od.quantity,
      od.product_status,
      od.iscomment,
      p.product_pic,
      p.product_name,
      p.description,
      p.price,
      p.old_price,
      p.stock
    FROM order_details od
    JOIN products p ON od.product_id = p.product_id
    WHERE od.user_id = ?
    LIMIT ?
    OFFSET ?;
  `;

  db.query(getOrderDetailsQuery, [userId, pageSize, offset], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.send({
        status: 200,
        message: '查询订单状态成功',
        orderList: setProductImg(results)
      })
    }

    res.send({
      status: 200,
      message: '查询订单状态成功',
      orderList: setProductImg(results),
    })
  })
}

// 获取购买后指定状态的订单商品
exports.getOrderTypeOne = (req, res) => {
  const { userId, orderType, currentPage, pageSize } = req.body
  console.log(currentPage, pageSize);
  console.log('订单状态', orderType);
  const offset = (currentPage - 1) * pageSize;
  const getOrderDetailsQuery = `
    SELECT
      od.order_detail_id,
      od.user_id,
      od.product_id,
      od.quantity,
      od.product_status,
      od.iscomment,
      p.product_pic,
      p.product_name,
      p.description,
      p.price,
      p.old_price,
      p.stock
    FROM order_details od
    JOIN products p ON od.product_id = p.product_id
    WHERE od.user_id = ? AND od.product_status = ?
    LIMIT ?
    OFFSET ?;`

  db.query(getOrderDetailsQuery, [userId, orderType, pageSize, offset], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      res.send({
        status: 200,
        message: '查询订单为空',
        orderList: results
      })
      return
    }

    res.send({
      status: 200,
      message: '查询订单状态成功',
      orderList: setProductImg(results)
    })
  })
}

// 删除订单商品
exports.deleteOrderItem = (req, res) => {
  const {orderId, userId, productId} = req.body

  /*
    * 删除指定商品之前先查一下一个订单下有多少个商品数量，然后存到变量里
    * 一个商品就带着该商品的订单一起删除，多个就删除指定商品，不删订单
  */
  const delOrderItemSql = `
  DELETE FROM order_details
  WHERE order_details.order_detail_id = ? AND order_details.user_id = ? AND order_details.product_id = ?;
  `;
  db.query(delOrderItemSql, [orderId, userId, productId], (delErr, delResults) => {
    if (delErr) {
      return res.cc(delErr)
    }
    if (delResults.affectedRows === 0) {
      return res.cc('单个订单商品删除失败')
    }

    res.send({
      status: 200,
      orderList: delResults
    })
  })
}

// 取消订单
exports.cancelOrderItem = (req, res) => {
  const {productStatus, userId, orderId, productId } = req.body

  const updateOrderSql = `
    UPDATE order_details od
    SET product_status = ?
    WHERE od.user_id = ? AND
          od.order_detail_id = ? AND
          od.product_id = ?;`

  db.query(updateOrderSql, [productStatus, userId, orderId, productId], (err, results)  => {
    if (err) {
      return res.cc(err)
    }

    if (results.affectedRows === 0) {
      return res.cc('取消失败')
    }

    res.send({
      status: 200,
      orderList: results
    })
  })
}

// 查询已完成但没有评价的订单或以评价的订单
exports.getcommOrderItem = (req, res) => {
  const { userId, productStatus, isComment} = req.body
  console.log(userId, productStatus, isComment);
  // 查询已完成但没有评价的订单
  if (isComment === 0) {
    const commOrderSql = `SELECT
      od.order_detail_id,
      od.user_id,
      od.product_id,
      od.quantity,
      od.product_status,
      od.iscomment,
      p.product_pic,
      p.product_name,
      p.description,
      p.price,
      p.old_price,
      p.stock
    FROM order_details od
    JOIN products p ON od.product_id = p.product_id
    WHERE od.user_id = ? AND od.product_status = ? AND od.iscomment = ?;`
    db.query(commOrderSql, [userId, productStatus, isComment], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.send({
          status: 200,
          message: '空',
          orderList: setProductImg(results)
        })
      }

      res.send({
        status: 200,
        message: '有已完成但没有评价的订单',
        orderList: setProductImg(results)
      })
      return
    })
  } else if (isComment === 1) {
    const commOrderSql = `SELECT
    od.order_detail_id,
    od.user_id,
    od.product_id,
    od.quantity,
    od.product_status,
    od.iscomment,
    p.product_pic,
    p.product_name,
    p.description,
    p.price,
    p.old_price,
    p.stock
  FROM order_details od
  JOIN products p ON od.product_id = p.product_id
  WHERE od.user_id = ? AND od.product_status = ? AND od.iscomment = ? OR od.iscomment = 2
  `

    db.query(commOrderSql, [userId, productStatus, isComment, userId, productStatus], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.send({
          status: 200,
          message: '空',
          orderList: setProductImg(results)
        })
      }

      res.send({
        status: 200,
        message: '有已完成但没有评价的订单',
        orderList: setProductImg(results)
      })
    })
  }
}

// 提交订单评价
exports.setCommOrderItem = (req, res) => {
  const { orderId, userId, productId, rating, comment} = req.body

  const commOrderItemSql = `UPDATE order_details
  SET iscomment = 1
  WHERE product_status = 2 AND order_detail_id = ? AND user_id = ? AND product_id = ?;`

  db.query(commOrderItemSql, [orderId, userId, productId], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows === 0) {
      return res.cc('订单评价失败')
    }

    const commItemSql = `INSERT INTO reviews (user_id, product_id, rating, comment)
    VALUES (?, ?, ?, ?);`

    db.query(commItemSql, [userId, productId, rating, comment], (commErr, commResults) => {
      if (commErr) {
        return res.cc(commErr)
      }
      if (commResults.length === 0) {
        return res.cc('评价失败')
      }

      res.send({
        status: 200,
        message: '评价完成'
      })
    })
  })
}

// 追加订单评价
exports.setCommItem = (req, res) => {
  const {orderId, userId, productId, rating ,comment} = req.body

  const commOrderItemSql = `UPDATE order_details
  SET iscomment = 2
  WHERE product_status = 2 AND order_detail_id = ? AND user_id = ? AND product_id = ?;`

  db.query(commOrderItemSql, [orderId, userId, productId], (inErr, inResults) => {
    if (inErr) {
      return res.cc(inErr)
    }
    if (inResults.affectedRows === 0) {
      return res.cc('修改订单评价状态失败')
    }

    const commsSql = `INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?);`
    db.query(commsSql, [userId, productId, rating, comment], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.cc('追评失败')
      }
      res.send({
        status: 200,
        message: '追评完成'
      })
    })
  })
}

// 获取售后指定订单
exports.getOrderOverItem = (req, res) => {
  const { userId, productStatus, isType} = req.body

  // 查询已完成但没有评价的订单
  if (isType === 0) {
    const commOrderSql = `SELECT
      od.order_detail_id,
      od.user_id,
      od.product_id,
      od.quantity,
      od.product_status,
      od.iscomment,
      p.product_pic,
      p.product_name,
      p.description,
      p.price,
      p.old_price,
      p.stock
    FROM order_details od
    JOIN products p ON od.product_id = p.product_id
    WHERE od.user_id = ? AND od.product_status = ?;`
    db.query(commOrderSql, [userId, productStatus], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.send({
          status: 200,
          message: '空',
          orderList: setProductImg(results)
        })
      }

      res.send({
        status: 200,
        message: '有已完成的订单',
        orderList: setProductImg(results)
      })
      return
    })
  } else if (isType === 1) {
    const commOrderSql = `SELECT
    od.order_detail_id,
    od.user_id,
    od.product_id,
    od.quantity,
    od.product_status,
    od.iscomment,
    p.product_pic,
    p.product_name,
    p.description,
    p.price,
    p.old_price,
    p.stock
  FROM order_details od
  JOIN products p ON od.product_id = p.product_id
  WHERE od.user_id = ? AND od.product_status = ?;
  `

    db.query(commOrderSql, [userId, productStatus], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.send({
          status: 200,
          message: '空',
          orderList: results
        })
      }

      res.send({
        status: 200,
        message: '有已完成售后的订单',
        orderList: setProductImg(results)
      })
    })
  }
}

// 改变售后订单状态，(售后按钮)
exports.setOrderItemType = (req, res) => {
  const { orderId, userId, productId} = req.body

  const commOrderItemSql = `UPDATE order_details
  SET product_status = 4
  WHERE order_detail_id = ? AND user_id = ? AND product_id = ?;`

  db.query(commOrderItemSql, [orderId, userId, productId], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows === 0) {
      return res.cc('售后失败')
    }

    res.send({
      status: 200,
      data: results
    })
  })
}