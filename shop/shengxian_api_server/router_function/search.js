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

// 获取搜索商品
exports.getSearchItem = (req, res) => {
  const { goodsName } = req.body

  // 先匹配是否是分类名称，是就返回该分类中所有的商品
  const searchCategoryNameSql = `SELECT
  products.product_id,
  products.product_name,
  products.description,
  products.product_pic,
  products.price,
  products.old_price,
  products.stock
  FROM categories
  JOIN products
  ON categories.category_id = products.category_id WHERE category_name = ?`
  db.query(searchCategoryNameSql, goodsName, (categoryErr, categoryResult) => {
    if (categoryErr) {
      return res.cc(categoryErr)
    }
    if (categoryResult.length !== 0) {
      return res.send({
        status: 200,
        message: '获取分类搜索商品成功',
        searchList: setProductImg(categoryResult)
      })
    }

    // 如果分类没有匹配成功，就匹配指定商品
    const searchSql = `SELECT
    product_id,
    product_name,
    product_pic,
    description,
    price,
    old_price,
    stock FROM products
    WHERE product_name LIKE ?;`
    db.query(searchSql, [`%${goodsName}%`], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.cc('还没有该商品')
      }

      res.send({
        status: 200,
        message: '获取搜索商品成功',
        searchList: setProductImg(results)
      })
    });
  })
}

// 获取搜索商品价格以升序排序
exports.getSearchItemAsc = (req, res) => {
  const { goodsName } = req.body

  const searchCategoryNameSql = `SELECT
  products.product_id,
  products.product_name,
  products.product_pic,
  products.description,
  products.price,
  products.old_price,
  products.stock
  FROM categories
  JOIN products
  ON categories.category_id = products.category_id
  WHERE category_name = ? ORDER BY products.price ASC;`
  db.query(searchCategoryNameSql, goodsName, (categoryErr, categoryResult) => {
    if (categoryErr) {
      return res.cc(categoryErr)
    }
    if (categoryResult.length !== 0) {
      return res.send({
        status: 200,
        message: '获取升序排序的搜索商品成功',
        searchList: setProductImg(categoryResult)
      })
    }

    const searchSql = `SELECT
    product_id,
    product_name,
    product_pic,
    description,
    price,
    old_price,
    stock FROM products
    WHERE product_name
    LIKE ? ORDER BY price ASC;`
    db.query(searchSql, [`%${goodsName}%`], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.cc('还没有该商品')
      }

      res.send({
        status: 200,
        message: '获取升序排序的搜索商品成功',
        searchList: setProductImg(results)
      })
    });
  })
}

// 获取搜索商品价格以降序排序
exports.getSearchItemDesc = (req, res) => {
  const { goodsName } = req.body
  const searchCategoryNameSql = `SELECT
  products.product_id,
  products.product_name,
  products.product_pic,
  products.description,
  products.price,
  products.old_price,
  products.stock
  FROM categories
  JOIN products
  ON categories.category_id = products.category_id
  WHERE category_name = ? ORDER BY products.price DESC;`
  db.query(searchCategoryNameSql, goodsName, (categoryErr, categoryResult) => {
    if (categoryErr) {
      return res.cc(categoryErr)
    }
    if (categoryResult.length !== 0) {
      return res.send({
        status: 200,
        message: '获取分类降序排序的搜索商品成功',
        searchList: setProductImg(categoryResult)
      })
    }

    const searchSql = `SELECT
    product_id,
    product_name,
    product_pic,
    description,
    price,
    old_price,
    stock
    FROM products
    WHERE product_name
    LIKE ? ORDER BY price DESC;`
    db.query(searchSql, [`%${goodsName}%`], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length === 0) {
        return res.cc('还没有该商品')
      }

      res.send({
        status: 200,
        message: '获取降序排序的搜索商品成功',
        searchList: setProductImg(results)
      })
    });
  })
}

