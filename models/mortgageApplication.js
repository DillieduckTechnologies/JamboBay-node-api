const db = require('../db/connection');
const { DateTime } = require('luxon');

const MortgageApplication = {
  tableName: 'mortgage_applications',

 create: async (data) => {
  data.submitted_at = DateTime.now().toISO();

  // Insert and get the ID
  const [inserted] = await db('mortgage_applications')
    .insert(data)
    .returning('id');

  // Ensure we get the integer ID
  const id = typeof inserted === 'object' ? inserted.id : inserted;

  return MortgageApplication.findById(id);
},


  findById: async (id) => {
    return db('mortgage_applications')
      .select(
        'mortgage_applications.*',
        'mortgage_providers.name as provider_name',
        'mortgage_providers.verified as provider_verified'
      )
      .leftJoin(
        'mortgage_providers',
        'mortgage_applications.provider_id',
        'mortgage_providers.id'
      )
      .where('mortgage_applications.id', id)
      .first();
  },

  findByClient: async (client_id) => {
    return db('mortgage_applications')
      .select('*')
      .where({ client_id })
      .orderBy('submitted_at', 'desc');
  },

  findAll: async (filters = {}) => {
    let query = db('mortgage_applications')
      .select(
        'mortgage_applications.*',
        'mortgage_providers.name as provider_name'
      )
      .leftJoin(
        'mortgage_providers',
        'mortgage_applications.provider_id',
        'mortgage_providers.id'
      )
      .orderBy('submitted_at', 'desc');

    if (filters.status) query.where('mortgage_applications.status', filters.status);
    if (filters.property_type) query.where('mortgage_applications.property_type', filters.property_type);

    return query;
  },

  update: async (id, data) => {
    if (data.status && ['approved', 'rejected', 'under_review'].includes(data.status)) {
      data.reviewed_at = DateTime.now().toISO();
    }
    await db('mortgage_applications').where({ id }).update(data);
    return MortgageApplication.findById(id);
  },

  delete: async (id) => {
    return db('mortgage_applications').where({ id }).del();
  }
};

module.exports = MortgageApplication;
