const router = require('express').Router()
const bcrypt = require('bcrypt')
const { Blog } = require('../models')
const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.json(users)
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).end()
    }
    user.name = req.body.name
    await user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, name, passwordHash })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const readingListWhere = {}
    if (req.query.read === 'true') {
      readingListWhere.read = true
    }
    else if (req.query.read === 'false') {
      readingListWhere.read = false
    }
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
        through: {
          attributes: ['id', 'read'],
          as: "reading_list",
          where: readingListWhere
        }
      }
    })
    if (!user) {
      return res.status(404).end()
    }
    res.json({
      name: user.name,
      username: user.username,
      readings: user.readings
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router