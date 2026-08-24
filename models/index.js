const Blog = require('./blog')
const User = require('./user')
const Session = require('./session')
const ReadingList = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)
User.hasMany(Session)

Session.belongsTo(User)

User.belongsToMany(Blog, {
  through: ReadingList, as: 'readings'
})
Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })

module.exports = {
  Blog, User, ReadingList, Session,
}