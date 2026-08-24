
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn('users', 'passwordHash', 'password_hash')
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn('users', 'password_hash', 'passwordHash')
  },
}