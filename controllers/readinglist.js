const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    const entry = await ReadingList.create({ blogId, userId })
    res.status(201).json(entry)
  } catch (error) {
    next(error)
  }
})

const { tokenExtractor } = require('../util/middleware')

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const entry = await ReadingList.findByPk(req.params.id)
    if (!entry) {
      return res.status(404).json({ error: 'reading list entry not found' })
    }

    if (entry.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: 'only the owner can mark this as read' })
    }

    entry.read = req.body.read
    await entry.save()
    res.json(entry)
  } catch (error) {
    next(error)
  }
})
module.exports = router