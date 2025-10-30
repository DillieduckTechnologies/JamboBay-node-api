const db = require('../db/connection');
const bcrypt = require('bcrypt');

const User = {
  getAll: () => db('users').select('*'),

  create: async (user) => {
    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const [newUser] = await db('users')
      .insert({
        ...user,
        password: hashedPassword,
      })
      .returning('*');

    return newUser;
  },

  findByUsername: (username) => db('users').where({ username }).first(),
};

module.exports = User;
