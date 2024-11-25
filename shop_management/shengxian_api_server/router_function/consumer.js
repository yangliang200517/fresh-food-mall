const db = require('../db/index')

// 获取轮播图
exports.getConsumer = (req, res) => {
  const sql = `
    SELECT
      user_id,
      name,
      full_name,
      sex,
      age,
      phone,
      email,
      user_time
    FROM users
  `
  db.query(sql, (err, results) => {
    if (err) {
        return res.retMsg(err)
    }
    if (results.length === 0) {
      return res.send({
          status: 200,
          message: '还没有消费者数据',
          data: results,
      })
    }

    return res.send({
      status: 200,
      message: '获取消费者数据成功',
      data: results,
    })
  })
}