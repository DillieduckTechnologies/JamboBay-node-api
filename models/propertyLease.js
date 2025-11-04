const db = require('../db/connection');

const PropertyLease = {
  // Create new lease
  async create(data) {
    const [lease] = await db('property_leases')
      .insert(data)
      .returning('*');
    return lease;
  },

  // Get all leases (optionally filtered by status or property type)
  async findAll(filters = {}) {
    let query = db('property_leases')
      .select('*')
      .orderBy('applied_at', 'desc');

    if (filters.status) {
      query = query.where('status', filters.status);
    }
    if (filters.client_profile_id) {
      query = query.where('client_profile_id', filters.client_profile_id);
    }
    if (filters.property_type === 'residential') {
      query = query.whereNotNull('residential_property_id');
    } else if (filters.property_type === 'commercial') {
      query = query.whereNotNull('commercial_property_id');
    }

    return query;
  },

  // Get single lease by ID
  async findById(id) {
    return db('property_leases').where({ id }).first();
  },

  // Update lease
  async update(id, data) {
    const [lease] = await db('property_leases')
      .where({ id })
      .update(data)
      .returning('*');
    return lease;
  },

  // Update lease status and reviewer info
 async reviewLease(id, reviewerId, status) {
  const leaseId = parseInt(id, 10);

  const [lease] = await db('property_leases')
    .where({ id: leaseId })
    .update({
      status,
      reviewed_by: reviewerId,
      reviewed_at: db.fn.now(),
    })
    .returning('*');

  return lease;
},

  // Delete lease
  async delete(id) {
    return db('property_leases').where({ id }).del();
  },
};

module.exports = PropertyLease;
