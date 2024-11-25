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

const setProductDetailImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3008/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      detail_img: item.detail_img ? serverAddress + '/' + item.detail_img.replace(/\\/g, '/') : serverAddress + '/images/default_image.jpg'
    };
  });

  return resultWithImageUrl
}

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

// 轮播图图片处理
const setCarouselImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3008/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      carousel_pic: item.carousel_pic ? serverAddress + '/' + item.carousel_pic.replace(/\\/g, '/') : serverAddress + '/images/default_image.jpg'
    };
  });

  return resultWithImageUrl
}

const getHomeCoursel = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, carousel_pic FROM carousel;`
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        const coursel = setCarouselImg(results);
        resolve(coursel);
      }
    });
  });
}


// 获取首页商品
exports.getGoods = (req, res) => {
  const goodsSql = "SELECT * FROM products"

  db.query(goodsSql, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.cc('获取首页数据失败')
    }

    getHomeCoursel()
    .then(coursels => {
      res.send({
        status: 200,
        message: '首页数据获取成功',
        goods: setProductImg(results),
        coursel: coursels
      })
    })
    .catch(err => {
      return res.cc(err);
    });
  })
}

// 获取商品详情页数据
exports.getGoodsDetail = (req, res) => {
  const productId = req.query.productId
  const goodsSql = "SELECT * FROM products WHERE product_id = ?"

  db.query(goodsSql, productId, async (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.cc('详情页数据获取失败')
    }

    const goodsDetailPic = await getGoodsDetailPic(productId)

    res.send({
      status: 200,
      message: '详情页数据获取成功',
      goods: setProductImg(results),
      goodsItemPic: goodsDetailPic
    })
  })
}

// 获取商品详情页轮播图数据
const getGoodsDetailPic = (productId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT
                  detail_id,
                  product_id,
                  detail_img
                FROM product_detail
                WHERE product_id = ?;`

    db.query(sql, productId, (err, results) => {
      if (err) {
        reject(err);
      } else {
        // 如果查询结果为空，则返回空数组
        resolve(results.length === 0 ? [] : setProductDetailImg(results))
      }
    })
  })
}

// 获取商品详情页评论数据
exports.getGoodsDetailComment = (req, res) => {
  const productId = req.query.productId

  const titSql = "SELECT product_name FROM products WHERE product_id = ?"
  db.query(titSql, productId, (err, resultsName) => {
    if (err) {
      return res.cc(err)
    }
    if (resultsName.length === 0) {
      return res.cc('详情页评论数据标题获取失败')
    }

    const sql = `SELECT
      reviews.review_id,
      users.user_pic,
      users.full_name,
      reviews.rating,
      reviews.comment,
      reviews.review_date
      FROM reviews
      JOIN users
      ON reviews.user_id = users.user_id
    WHERE reviews.product_id = ?`

    db.query(sql, productId, (err, results) => {
      if (err) {
        return res.cc(err)
      }

      res.send({
        status: 200,
        message: '详情页评论数据获取成功',
        commentList: setUserPic(results),
        title: resultsName
      })
    })
  })
}
