const db = require('../db/connection');

const Agent = {
  async create(data) {
    const [agent] = await db('agents')
      .insert(data)
      .returning('*');
    return agent;
  },

  async findAll() {
    return db('agents').select('*').orderBy('created_at', 'desc');
  },

  async findById(id) {
    return db('agents').where({ id }).first();
  },

  async update(id, data) {
    const [updated] = await db('agents')
      .where({ id })
      .update(data)
      .returning('*');
    return updated;
  },

  async delete(id) {
    return db('agents').where({ id }).del();
  }
};

module.exports = Agent;
