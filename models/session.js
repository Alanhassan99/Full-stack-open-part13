const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')


class Session extends Model { }
Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'session',
  timestamps: false
})

module.exports = Session