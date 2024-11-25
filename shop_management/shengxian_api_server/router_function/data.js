const db = require('../db/index')

// 获取指定分下的每个商品评价数据
exports.getData = (req, res) => {
    const { category_id,  rating} = req.body
    let ratingSql = ''
    switch (rating) {
        case 1:
            ratingSql = 'r.rating = 5'
            break;
        case 2:
            ratingSql = 'r.rating > 2 AND r.rating < 5'
            break;
        case 3:
            ratingSql = 'r.rating < 3'
            break;
        default:
            break;
    }
  const sql = `
    SELECT
        p.product_name,
        COALESCE(SUM(CASE WHEN ${ratingSql} THEN 1 ELSE 0 END), 0) AS total_reviews
    FROM
        reviews r
    INNER JOIN
        products p ON r.product_id = p.product_id
    INNER JOIN
        categories c ON p.category_id = c.category_id
    WHERE
        c.category_id = ?
    GROUP BY
        p.product_name
    ORDER BY
        total_reviews DESC;
  `

  db.query(sql, category_id, (err, results) => {
    if (err) {
        return res.retMsg(err)
    }
    if (results.length === 0) {
        return res.send({
            status: 200,
            message: '还没有数据',
            data: results,
        })
    }

    return res.send({
        status: 200,
        message: '获取数据成功',
        data: results,
    })
  })
}

// 获取指定分类评价占比
exports.getCateReviewsData = (req, res) => {
    const { category_id } = req.body
    const sql = `
    SELECT
        c.category_name,
        COALESCE(SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END), 0) AS good_reviews,
        COALESCE(SUM(CASE WHEN r.rating < 3 THEN 1 ELSE 0 END), 0) AS bad_reviews,
        COALESCE(SUM(CASE WHEN r.rating > 2 AND r.rating < 5 THEN 1 ELSE 0 END), 0) AS average_reviews,
        COALESCE(COUNT(r.rating), 0) AS total_reviews,
        ROUND((COALESCE(SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END), 0) / COALESCE(COUNT(r.rating), 1)) * 100, 2) AS good_percentage,
        ROUND((COALESCE(SUM(CASE WHEN r.rating < 3 THEN 1 ELSE 0 END), 0) / COALESCE(COUNT(r.rating), 1)) * 100, 2) AS bad_percentage,
        ROUND((COALESCE(SUM(CASE WHEN r.rating > 2 AND r.rating < 5 THEN 1 ELSE 0 END), 0) / COALESCE(COUNT(r.rating), 1)) * 100, 2) AS average_percentage
    FROM
        categories c
    LEFT JOIN
        products p ON p.category_id = c.category_id
    LEFT JOIN
        reviews r ON r.product_id = p.product_id
    WHERE
        c.category_id = ?
    GROUP BY
        c.category_name;
  `

    db.query(sql, category_id, (err, results) => {
        if (err) {
            return res.retMsg(err)
        }
        if (results.length === 0) {
            return res.send({
                status: 200,
                message: '还没有分类评价数据',
                data: results,
            })
        }

        // 将数据格式转换一下
        const processedData = results.map(item => {
            const { category_name, good_reviews, bad_reviews, average_reviews, total_reviews, good_percentage, bad_percentage, average_percentage } = item;
            return {
                name: category_name,
                count: total_reviews,
                data: [
                    { name: "好评", num: good_reviews, value: good_percentage },
                    { name: "中评", num: average_reviews, value: average_percentage },
                    { name: "差评", num: bad_reviews, value: bad_percentage }
                ]
            }
        });

        return res.send({
            status: 200,
            message: '获取分类评价数据成功',
            data: processedData,
        })
    })
}

// 获取指定分类下的所有商品的库存量
exports.getCateProductData = (req, res) => {
    const { category_id } = req.body
    const sql = `
    SELECT
        p.product_name AS name,
        COALESCE(p.stock, 0) AS value
    FROM
        products p
    LEFT JOIN
        categories c ON p.category_id = c.category_id
    WHERE
        c.category_id= ?;
    `
    db.query(sql, category_id, (err, results) => {
        if (err) {
            return res.retMsg(err)
        }
        if (results.length === 0) {
            return res.send({
                status: 200,
                message: '还没有商品的库存量数据',
                data: results,
            })
        }

        return res.send({
            status: 200,
            message: '获取商品的库存量数据成功',
            data: results,
        })
    })
}