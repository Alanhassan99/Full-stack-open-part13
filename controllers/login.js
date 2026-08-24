const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ where: { username } })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (user && user.disabled === true) {
    return response.status(401).json({ error: 'USER IS DISABLED WHATS UP' })
  }

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const userForToken = { username: user.username, id: user.id }
  const token = jwt.sign(userForToken, SECRET)
  await Session.create({ userId: user.id, token: token })
  response.status(200).send({ token, username: user.username, name: user.name })
})

router.delete('/', async (request, response) => {
  const authorization = request.get('authorization')
  const token = authorization.substring(7)
  const session = await Session.findOne({ where: { token: token } })
  if (!session) {
    return response.status(401).json({ error: 'THERE IS NO SESSION' })
  }
  await session.destroy()
  response.status(204).end()

})
module.exports = router