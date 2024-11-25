const db = require('../db/index')

// 转用户图片
const setUserPic = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3007/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      user_pic: item.user_pic ? serverAddress + '/' + item.user_pic.replace(/\\/g, '/') : serverAddress + '/images/1.png'
    };
  });

  return resultWithImageUrl
}


// 获取好评数据
exports.getCommentGoodStart = (req, res) => {
  const { productId} = req.body
  const commentSql = 'SELECT reviews.review_id, users.user_pic, users.full_name, reviews.rating, reviews.comment, reviews.review_date FROM reviews JOIN users ON reviews.user_id = users.user_id AND reviews.rating = 5 WHERE reviews.product_id = ?'
  db.query(commentSql,  productId, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.cc('暂无好评')
    }

    res.send({
      status: 200,
      message: '好评获取获取成功',
      commentGood: setUserPic(results),
    })
  })
}

// 获取中评数据
exports.getCommentMiddleStart = (req, res) => {
  const { productId} = req.body
  const commentSql = 'SELECT reviews.review_id, users.user_pic, users.full_name, reviews.rating, reviews.comment, reviews.review_date FROM reviews JOIN users ON reviews.user_id = users.user_id AND reviews.rating > 2 AND reviews.rating < 5 WHERE reviews.product_id = ?'
  db.query(commentSql,  productId, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.cc('暂无中评')
    }

    res.send({
      status: 200,
      message: '中评获取获取成功',
      commentGood: setUserPic(results),
    })
  })
}
// 获取差评数据
exports.getCommentBadStart = (req, res) => {
  const { productId} = req.body
  const commentSql = 'SELECT reviews.review_id, users.user_pic, users.full_name, reviews.rating, reviews.comment, reviews.review_date FROM reviews JOIN users ON reviews.user_id = users.user_id AND reviews.rating < 3 WHERE reviews.product_id = ?'
  db.query(commentSql,  productId, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.cc('暂无差评')
    }

    res.send({
      status: 200,
      message: '差评获取获取成功',
      commentGood: setUserPic(results),
    })
  })
}