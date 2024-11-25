const db = require('../db/index')

// 转图片
const setProductImg = (imgData) => {
  const serverAddress = 'http://127.0.0.1:3008/api'
  const resultWithImageUrl = imgData.map(item => {
    return {
      ...item,
      pic: item.pic ? serverAddress + '/' + item.pic.replace(/\\/g, '/') : serverAddress + '/images/default_image.jpg'
    };
  });

  return resultWithImageUrl
}


// 获取分类数据
exports.getFenleiData = (req, res) => {
  const getFenleiDataSql = `SELECT
  categories.category_id,
  categories.category_name,
  products.product_id,
  products.product_name,
  products.product_pic
  FROM categories
  JOIN products
  ON products.category_id = categories.category_id;`

  db.query(getFenleiDataSql, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.cc('分类数据查询失败')
    }

    // 初始化数据格式
    const resultMap = {};

    // 遍历返回来的数据
    results.forEach(row => {
      const categoryId = row.category_id;
      const categoryName = row.category_name;
      const productId = row.product_id;
      const productName = row.product_name;
      const productPic = row.product_pic;


      if (!resultMap[categoryId]) {
        resultMap[categoryId] = {
          fenleiId: categoryId,
          text: categoryName,
          children: []
        };
      }
      const formattedPic = setProductImg([{ pic: productPic }])[0].pic;
      resultMap[categoryId].children.push({
        text: productName,
        goodsId: productId,
        pic: formattedPic
      })
    })

    // 将 resultMap 转换为数组
    const resultArray = Object.values(resultMap)

    res.send({
      status: 200,
      data: resultArray
    })
  })

}