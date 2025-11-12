const db = require('../db/connection');

const CommercialProperty = {
  async create(data) {
    const [property] = await db('commercial_properties')
      .insert(data)
      .returning('*');
    return property;
  },

  async findAll() {
    return db('commercial_properties').orderBy('created_at', 'desc');
  },

  async findAllPending() {
    return db('commercial_properties')
      .where({ approved: false })
      .orderBy('created_at', 'desc');
  },

  async findById(id) {
    return db('commercial_properties').where({ id }).first();
  },

  async update(id, data) {
    const [property] = await db('commercial_properties')
      .where({ id })
      .update(data)
      .returning('*');
    return property;
  },

  async delete(id) {
    return db('commercial_properties').where({ id }).del();
  },
};

module.exports = CommercialProperty;
