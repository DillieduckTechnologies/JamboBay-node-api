const db = require('../db/connection');

const PropertyViewing = {
  async create(viewing) {
    const result = await db('property_viewings')
      .insert(viewing)
      .returning('*');
    return result[0];
  },

  async findById(id) {
    return db('property_viewings').where({ id }).first();
  },

  async findAll() {
    return db('property_viewings').orderBy('created_at', 'desc');
  },

  async findByAgent(agent_id) {
    return db('property_viewings')
      .where({ agent_id })
      .orderBy('created_at', 'desc');
  },

  async findByClient(client_id) {
    return db('property_viewings')
      .where({ client_id })
      .orderBy('created_at', 'desc');
  },

  async update(id, data) {
    await db('property_viewings').where({ id }).update(data);
    return this.findById(id);
  },

  async delete(id) {
    return db('property_viewings').where({ id }).del();
  }
};

module.exports = PropertyViewing;
