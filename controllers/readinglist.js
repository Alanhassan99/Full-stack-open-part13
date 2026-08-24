const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    if (!blogId || !userId) {
      return res.status(400).json({ error: 'blogId and userId are required' })
    }

    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    const existing = await ReadingList.findOne({ where: { blogId, userId } })
    if (existing) {
      return res.status(400).json({ error: 'blog already in reading list' })
    }

    const entry = await ReadingList.create({ blogId, userId })
    res.status(201).json({
      id: entry.id,
      blog_id: entry.blogId,
      user_id: entry.userId,
      read: entry.read
    })
  } catch (error) {
    next(error)
  }
})


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