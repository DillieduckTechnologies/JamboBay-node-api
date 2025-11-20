const db = require('../db/connection');

const ResidentialProperty = {
  async create(data) {
    const [property] = await db('residential_properties')
      .insert(data)
      .returning('*');
    return property;
  },

  
  async findAll() {
    return db('residential_properties').orderBy('created_at', 'desc');
  },

  async findAllPending() {
    return db('residential_properties')
      .where({ approved: false })
      .orderBy('created_at', 'desc');
  },

  async findById(id) {
    return db('residential_properties').where({ id }).first();
  },

  async update(id, data) {
    const [property] = await db('residential_properties')
      .where({ id })
      .update(data)
      .returning('*');
    return property;
  },

  async delete(id) {
    return db('residential_properties').where({ id }).del();
  },
};

module.exports = ResidentialProperty;
