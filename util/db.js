const Sequelize = require('sequelize')
const { DATABASE_URL, TEST_DATABASE_URL } = require('./config')

const isTest = process.env.TESTING === 'true'
const url = isTest ? TEST_DATABASE_URL : DATABASE_URL

const sequelize = new Sequelize(url, isTest ? {} : {
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }
  return null
}

module.exports = { connectToDatabase, sequelize }