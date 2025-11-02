const db = require('../db/connection');

const Company = {
    create: async (company) => {
    const result = await db('companies')
      .insert(company)
      .returning('*');
    
    return result[0]; // Return the first element of the array
  },

  async findById(id) {
    return db('companies').where({ id }).first();
  },

  async findAll() {
    return db('companies').orderBy('created_at', 'desc');
  },

  async update(id, data) {
    await db('companies').where({ id }).update(data);
    return this.findById(id);
  },

  async delete(id) {
    return db('companies').where({ id }).del();
  }
};

module.exports = Company;
