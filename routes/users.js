var express = require('express');
var router = express.Router();
const models = require("../models")
const { Op } = require("sequelize")
const path = require("path")

router.get('/phonebooks/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const user = await models.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }
    return res.status(200).json(user)
  } catch (err) {
    console.log('ini erorr dari get users get =>', err)
    res.status(500).json({ err })
  }
});


router.get('/phonebooks', async function (req, res, next) {
  try {
    const { page = 1, limit = 30, keyword = "", sort = "ASC" } = req.query
    console.log('keyword be -> ', keyword)
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
      page: Number(page),
      limit: Number(limit),
      pages: Number(pages),
      total: count
    })
  } catch (err) {
    console.log('ini erorr dari get users get =>', err)
    res.status(500).json({ err })
  }
});

router.post('/phonebooks', async function (req, res, next) {
  try {
    const { name, phone } = req.body
    if (!name && !phone) res.status(500).json(new Error("name and phone don't be empty"))
    const users = await models.User.create({ name, phone });
    res.status(201).json(users)
  } catch (err) {
    console.log('ini erorr dari get users add =>', err)
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
    console.log('ini erorr dari get users delete =>', err)
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
    console.log('ini erorr dari get users edit data =>', err)
    res.status(500).json({ err })
  }
});

router.put('/phonebooks/:id/avatar', async function (req, res, next) {
  try {
    const id = req.params.id
    let avatar;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length == 0) {
      return res.status(400).send('no file were uploaded')
    }

    avatar = req.files.avatar
    let fileName = Date.now() + '_' + avatar.name
    uploadPath = path.join(__dirname, '..', '..', 'phonebooks-react', 'public', 'images', fileName)

    avatar.mv(uploadPath, async function (err) {
      if (err) {
        console.log('Error uploading file', err)
        return res.status(500).send(`Error uploading file: ${err.message}`)
      }
      try {
        const [updated] = await models.User.update({ avatar: fileName }, {
          where: { id: id }
        });

        if (updated === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await models.User.findOne({
          where: { id: id }
        });

        return res.status(200).json(updatedUser);
      } catch (updateErr) {
        console.log('Api, routes, avatar, line 135 => ', updateErr)
        return res.status(500).json({ error: updateErr.message })
      }
    })
  } catch (err) {
    console.log('ini erorr dari get users edit avatar =>', err)
    res.status(500).json({ err })
  }
});

module.exports = router;
