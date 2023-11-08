var express = require('express');
var router = express.Router();
const models = require("../models")
const { Op } = require("sequelize")
const path = require("path")


router.get('/phonebooks', async function (req, res, next) {
  try {
    const { page = 1, limit = 10, keyword = "", sort = "ASC" } = req.query
    const { count, rows } = await models.User.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { phone: { [Op.iLike]: `%${keyword}%` } }
        ]
      },
      order: [["name", sort]],
      limit,
      offset: (page - 1) * limit
    });
    const pages = Math.ceil(count / limit)
    res.status(200).json({
      phonebooks: rows,
      page,
      limit,
      pages,
      total: count
    })
  } catch (err) {
    console.log('ini erorr dari get users =>', err)
    res.status(500).json({ err })
  }
});

router.post('/phonebooks', async function (req, res, next) {
  try {
    const { name, phone } = req.body
    if(!name && !phone) res.status(500).json(new Error("name and phone don't be empty"))
    const users = await models.User.create({ name, phone });
    res.status(201).json(users)
  } catch (err) {
    console.log('ini erorr dari get users =>', err)
    res.status(500).json({ err })
  }
});

router.delete('/phonebooks/:id', async function (req, res, next) {
  try {
    const id = req.params.id

    const user = await models.User.findOne({
      where: {
        id: id
      }
    });
    if (!user) {
      res.status(400).json({ message: "user not found" })
    }
    await models.User.destroy({
      where: {
        id: id
      }
    })
    return res.status(200).json(user)

  } catch (err) {
    console.log('ini erorr dari get users =>', err)
    res.status(500).json({ err })
  }
});

router.put('/phonebooks/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const { name, phone } = req.body

    // updated di eksekusi saat menjalankan operasi update 
    const [updated] = await models.User.update({ name, phone }, {
      where: {
        id: id
      }
    });

    if (updated === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await models.User.findOne({
      where: {
        id: id
      }
    });

    return res.status(201).json(updatedUser);

  } catch (err) {
    console.log('ini erorr dari get users =>', err)
    res.status(500).json({ err })
  }
});

router.put('/phonebooks/:id/avatar', async function (req, res, next) {
  try {
    const id = req.params.id
    const { avatar } = req.body

    // updated di eksekusi saat menjalankan operasi update 
    const [updated] = await models.User.update({ avatar }, {
      where: {
        id: id
      }
    });

    if (updated === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await models.User.findOne({
      where: {
        id: id
      }
    });

    return res.status(200).json(updatedUser);

  } catch (err) {
    console.log('ini erorr dari get users =>', err)
    res.status(500).json({ err })
  }
});

module.exports = router;
