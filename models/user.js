const db = require('../db/connection');
const bcrypt = require('bcrypt');

const User = {
  // Get all users
  getAll: () => db('users').select('*'),

  // Create new user with hashed password
  create: async (user) => {
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

  // Find by username
  findByUsername: (username) => db('users').where({ username }).first(),

  // ✅ Find by email
  findByEmail: (email) => db('users').where({ email }).first(),

  // ✅ Find by user ID
  findById: (id) => db('users').where({ id }).first(),

  // ✅ Find by password reset token
  findByResetToken: (token) =>
    db('users').where({ password_reset_token: token }).first(),

  // ✅ Update user record by ID
  update: (id, data) => db('users').where({ id }).update(data),
};

module.exports = User;
