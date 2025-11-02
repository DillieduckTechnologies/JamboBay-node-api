const db = require('../db/connection');

const AgentReference = {
   async create(data) {
    const [record] = await db('agent_references')
      .insert(data)
      .returning('*');
    return record;
  },

  async findById(id) {
    return db('agent_references').where({ id }).first();
  },

  async findByAgent(agent_id) {
    return db('agent_references')
      .where({ agent_id })
      .orderBy('created_at', 'desc');
  },

  async update(id, data) {
    await db('agent_references').where({ id }).update(data);
    return this.findById(id);
  },

  async delete(id) {
    return db('agent_references').where({ id }).del();
  },
};

module.exports = AgentReference;
