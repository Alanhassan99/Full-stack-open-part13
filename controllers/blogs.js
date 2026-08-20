const router = require('express').Router()

const { Blog } = require('../models')
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')
const { User } = require('../models')



const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })
  console.log(JSON.stringify(blogs))
  return res.json(blogs)

})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.blog.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: 'only the creator can delete this blog' })
    }
    await req.blog.destroy()
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})


router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})


router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  }
  catch (error) {
    next(error)
  }
})

module.exports = router