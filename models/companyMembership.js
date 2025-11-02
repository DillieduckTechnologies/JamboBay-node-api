const db = require('../db/connection');

const CompanyMembership = {
  async create(data) {
    const inserted = await db('company_memberships')
      .insert(data)
      .returning('id');

    const id = inserted[0]?.id || inserted[0];
    return this.findById(id);
  },

  async findById(id) {
    return db('company_memberships').where({ id }).first();
  },

  async findAll() {
    return db('company_memberships').orderBy('requested_at', 'desc');
  },

  async update(id, data) {
    await db('company_memberships').where({ id }).update(data);
    return this.findById(id);
  },

  async delete(id) {
    return db('company_memberships').where({ id }).del();
  },
};

module.exports = CompanyMembership;
