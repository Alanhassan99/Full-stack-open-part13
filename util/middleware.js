const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const Session = require('../models/session')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const session = await Session.findOne({
        where: {
          token: authorization.substring(7)
        }
      })
      if (!session) {
        return res.status(401).json({ error: 'NO SESSION WHATSUP' })
      } else {
        next()
      }
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
}



const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }


  next(error)
}

module.exports = { errorHandler, tokenExtractor }