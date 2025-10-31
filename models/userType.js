const db = require('../db/connection');

const UserType = {
  getAll: () => db('user_types').select('*'),

  findById: (id) => db('user_types').where({ id }).first(),

  create: async (data) => {
    const [newType] = await db('user_types')
      .insert(data)
      .returning('*');
    return newType;
  },
};

module.exports = UserType;
