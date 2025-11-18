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
  async findUserIdByProfileId(id) {
    const agent = await db('agents').where({ id }).first();
    return agent ? agent.user_id : null;
  },

  async findAgentProfile(id) {
    const agent = await db('agents')
      .join('users', 'agents.user_id', 'users.id')
      .select(
        'agents.*',
        'users.username',
        'users.email'
      )
      .where('agents.id', id)
      .first();

    if (!agent) return null;
    const references = await db('agent_references')
      .where({ agent_id: id })
      .select('*');

    agent.references = references;

    return agent;
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
