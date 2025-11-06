const db = require('../db/connection');

const PurchaseApplication = {
  // Create a new purchase application
  async create(data) {
    const inserted = await db('purchase_applications').insert(data).returning('id');
  const id = inserted[0]?.id || inserted[0];
  return this.findById(id);

  },

  // Find purchase by ID
  async findById(id) {
    return db('purchase_applications')
      .select('*')
      .where({ id })
      .first();
  },

  // Get all purchase applications (with optional filters)
  async findAll(filters = {}) {
    let query = db('purchase_applications')
      .select(
        'purchase_applications.*',
        'client_profiles.full_name as client_name',
        'client_profiles.email as client_email',
        'users.name as reviewed_by_name'
      )
      .leftJoin('client_profiles', 'client_profiles.id', 'purchase_applications.client_id')
      .leftJoin('users', 'users.id', 'purchase_applications.reviewed_by');

    if (filters.status) query.where('purchase_applications.status', filters.status);
    if (filters.property_type) query.where('purchase_applications.property_type', filters.property_type);

    return query.orderBy('purchase_applications.applied_at', 'desc');
  },

  // Update a purchase application
  async update(id, data) {
    await db('purchase_applications').where({ id }).update(data);
    return this.findById(id);
  },

  // Delete (optional)
  async delete(id) {
    return db('purchase_applications').where({ id }).del();
  },
};

module.exports = PurchaseApplication;
