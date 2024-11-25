const db = require('../db/index')

//获取地址
exports.getAddress = (req, res) => {
  const { userId } = req.body;

  const addressSql = `SELECT
    a.address_id,
    u.name,
    u.phone,
    a.state,
    a.city,
    a.street_address,
    a.region,
    a.is_default
    FROM addresses AS a JOIN users AS u ON a.user_id = u.user_id WHERE a.user_id = ?;`

  db.query(addressSql, userId, (err, results) => {
    if (err) {
      return res.cc(err)
    }

    if (results.length === 0) {
      return res.send({
        status: 200,
        message: '用户地址为空',
        addresList: results
      })
    }

    res.send({
      status: 200,
      message: '用户地址获取成功',
      addresList: results
    })
  })
}

// 获取用户信息
exports.selUserInfo = (req, res) => {
  const selectUserInfoSql = `SELECT u.name, u.phone FROM users AS u
  WHERE u.user_id = ?;`

  db.query(selectUserInfoSql, req.body.userId,  (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.cc('用户信息获取失败')
    }

    res.send({
      status: 200,
      message: '用户信息获取成功',
      addresList: results
    })
  })
}

// 新增地址
exports.insNewAddress = (req, res) => {
  const {userId, name, state, city, region, streetAddress, isDefault} = req.body

  /*
   * 先判断选中状态，如果为false(未选中)，就直接插入
   * 如果为true(选中)，就先插入地址信息，然后再把该用户的所有地址的is_default设置为 false
   * 然后再把指定地址的is_default设置为 true
  */

  if (isDefault === false) {
    const insNewAddressSql = `INSERT INTO addresses
    (user_id, recipient_name, state, city, region, street_address, is_default)
    VALUES(?, ?, ?, ?, ?, ?, ?)`

    db.query(insNewAddressSql, [userId, name, state, city, region, streetAddress, isDefault], (newErr, newResults) => {
      if (newErr) {
        return res.cc(newErr)
      }
      if (newResults.affectedRows !== 1) {
        return res.cc('新增地址失败')
      }
      res.send({
        status: 200,
        message: '不是默认地址插入成功'
      })
    })
  } else if (isDefault === true) {
    const insNewAddressSql = `INSERT INTO addresses
    (user_id, recipient_name, state, city, region, street_address)
    VALUES(?, ?, ?, ?, ?, ?)`

    db.query(insNewAddressSql, [userId, name, state, city, region, streetAddress], (newErr, newResults) => {
      if (newErr) {
        return res.cc(newErr)
      }
      if (newResults.affectedRows !== 1) {
        return res.cc('新增地址失败')
      }
      const addressId = newResults.insertId

      /*
       * 设置默认地址
       * 先把该用户下的所有地址的is_default设置为 false
       * 然后再把指定地址的is_default设置为 true
      */
      const setIsDefaultSql = `UPDATE addresses AS a
      JOIN users AS u ON a.user_id = u.user_id
      SET a.is_default = false
      WHERE a.user_id = ?;`

      db.query(setIsDefaultSql, userId, (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows === 0) {
          return res.cc('修改默认地址失败')
        }

        const insIsDefaultSql = `UPDATE addresses AS a
          JOIN users AS u ON a.user_id = u.user_id
          SET a.is_default = ?
          WHERE a.address_id = ? AND a.user_id = ?;`

        db.query(insIsDefaultSql, [isDefault, addressId, userId], (insErr, insDefaults) => {
          if (insErr) {
            return res.cc(insErr)
          }
          if (insDefaults.affectedRows === 0) {
            return res.cc('插入默认地址失败')
          }

          res.send({
            status: 200,
            message: 'yes',
            addressList: insDefaults
          })
        })
      })
    })
  }
}

// 修改收货地址
exports.setAddress = (req, res) => {
  const { name, phone, addressId, userId, state, city, region, streetAddress, isDefault} = req.body;

  if (isDefault === false) {
    const updateAddress = `UPDATE addresses AS a
      JOIN users AS u ON a.user_id = u.user_id
      SET u.name = ?,
      u.phone = ?,
      a.recipient_name = ?,
      a.state = ?,
      a.city = ?,
      a.region = ?,
      a.street_address = ?,
      a.is_default = ?
      WHERE a.address_id = ? AND a.user_id = ?;`

    db.query(updateAddress, [name, phone, name, state, city, region, streetAddress, isDefault, addressId, userId], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.affectedRows === 0) {
        return res.cc('修改地址失败')
      }
      res.send({
        status: 200,
        message: 'yes',
        addressList: results
      })
    })
  } else if (isDefault === true) {
    const updateAddress = `UPDATE addresses AS a
      JOIN users AS u ON a.user_id = u.user_id
      SET u.name = ?,
      u.phone = ?,
      a.recipient_name = ?,
      a.state = ?,
      a.city = ?,
      a.region = ?,
      a.street_address = ?
      WHERE a.address_id = ? AND a.user_id = ?;`

    db.query(updateAddress, [name, phone, name, state, city, region, streetAddress, addressId, userId], (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.affectedRows === 0) {
        return res.cc('修改地址失败')
      }

      const setIsDefaultSql = `UPDATE addresses AS a
        JOIN users AS u ON a.user_id = u.user_id
        SET a.is_default = false
        WHERE a.user_id = ?;`

      db.query(setIsDefaultSql, userId, (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows === 0) {
          return res.cc('修改默认地址失败')
        }

        const insIsDefaultSql = `UPDATE addresses AS a
          JOIN users AS u ON a.user_id = u.user_id
          SET a.is_default = ?
          WHERE a.address_id = ? AND a.user_id = ?;`

        db.query(insIsDefaultSql, [isDefault, addressId, userId], (insErr, insDefaults) => {
          if (insErr) {
            return res.cc(insErr)
          }
          if (insDefaults.affectedRows === 0) {
            return res.cc('插入默认地址失败')
          }

          res.send({
            status: 200,
            message: 'yes',
            addressList: results
          })
        })
      })
    })
  }
}

// 删除收货地址
exports.delAddress = (req, res) => {
  const { addressId, userId } = req.body
  console.log(addressId, userId);
  const delAddress = `DELETE FROM addresses WHERE address_id = ? AND user_id = ?`

  db.query(delAddress, [addressId, userId], (err, results) => {
    if  (err) {
      return res.cc(err)
    }
    if (results.affectedRows < 1) {
      return res.cc('地址删除失败')
    }

    res.send({
      status: 200,
      message: 'yes',
      addressList: results
    })
  })
}

// 设置默认地址
exports.setIsDefaultAddress = (req, res) => {
  const { userId, addressId, isDefault } = req.body

  const setIsDefaultSql = `UPDATE addresses AS a
    JOIN users AS u ON a.user_id = u.user_id
    SET a.is_default = false
    WHERE a.user_id = ?;`

  db.query(setIsDefaultSql, userId, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows === 0) {
      return res.cc('修改默认地址失败')
    }

    const insIsDefaultSql = `UPDATE addresses AS a
      JOIN users AS u ON a.user_id = u.user_id
      SET a.is_default = ?
      WHERE a.address_id = ? AND a.user_id = ?;`

    db.query(insIsDefaultSql, [isDefault, addressId, userId], (insErr, insDefaults) => {
      if (insErr) {
        return res.cc(insErr)
      }
      if (insDefaults.affectedRows === 0) {
        return res.cc('插入默认地址失败')
      }

      res.send({
        status: 200,
        message: 'yes',
        addressList: results
      })
    })
  })
}
