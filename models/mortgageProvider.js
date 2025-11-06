const db = require('../db/connection');

const MortgageProvider = {
  create: async (provider) => {
    const result = await db('mortgage_providers')
      .insert(provider)
      .returning('*'); // returning all columns
    return result[0]; // return the first row inserted
  },

  async findById(id) {
    return db('mortgage_providers').where({ id }).first();
  },

  async findAll() {
    return db('mortgage_providers').select('*').orderBy('name', 'asc');
  },

  async update(id, data) {
    await db('mortgage_providers').where({ id }).update(data);
    return this.findById(id);
  },

  async delete(id) {
    return db('mortgage_providers').where({ id }).del();
  }
};

module.exports = MortgageProvider;
