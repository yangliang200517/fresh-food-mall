const db = require('../db/index')

const sql = `SELECT * FROM order_details WHERE product_status = 1;`
// let index = 0

// exports.setProductStatus = async () => {
//   await db.query(sql, async (err, results) => {
//     if (err) {
//       return res.cc(err)
//     }
//     if (results.length === 0) {
//       console.log('没有插入新的订单');
//       return
//     }

//     const dbSql = `UPDATE order_details
//                   SET product_status = 2
//                   WHERE order_detail_id = ? AND product_status = ?;`

//     while (index < results.length) {
//       const element = results[index];

//       await db.query(dbSql, [element.order_detail_id, element.product_status], (dbErr, dbResults) => {
//         if (dbErr) {
//           return res.cc(dbErr)
//         }
//         if (dbResults.affectedRows === 0) {
//           return console.log('修改订单状态失败！');
//         }
//       })

//       index++
//       await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒,每10秒更新一个订单
//     }
//   })
// }

exports.setProductStatus = async () => {
  return new Promise((resolve, reject) => {
    db.query(sql, async (err, results) => {
      if (err) {
        reject(err)
      }

      if (results.length === 0) {
        console.log('没有插入新的订单')
        resolve()
        return
      }

      const updateOrderStatus = async (index) => {
        if (index >= results.length) {
          resolve()
          return
        }

        const element = results[index]

        const dbSql = `UPDATE order_details
                      SET product_status = 2
                      WHERE order_detail_id = ? AND product_status = ?;`

        try {
          await db.query(dbSql, [element.order_detail_id, element.product_status])
          console.log(`订单 ${element.order_detail_id} 的状态已更新`)
        } catch (error) {
          console.error(`更新订单状态失败: ${error.message}`)
        }

        setTimeout(() => {
          updateOrderStatus(index + 1);
        }, 5000) // 每5秒更新一个订单
      }

      updateOrderStatus(0);
    })
  })
}