const db = require('../db/connection');
const { findById } = require('./chat');

const ClientProfile = {
  create: (profile) => db('client_profiles').insert(profile).returning('*'),



  update: (user_id, data) =>
    db('client_profiles').where({ user_id }).update(data).returning('*'),

  async findById(id) {
    return db('client_profiles').where({ id }).first();
  },
  async findUserIdByProfileId(id) {
    const profile = await db('client_profiles').where({ id }).first();
    return profile ? profile.user_id : null;
  },

  findByUserId: (user_id) =>
    db('client_profiles')
      .select(
        'client_profiles.*',
        'users.first_name as first_name',
        'users.last_name as last_name',
        'users.email',
        'user_types.name as user_type'
      )
      .leftJoin('users', 'client_profiles.user_id', 'users.id')
      .leftJoin('user_types', 'users.user_type_id', 'user_types.id')
      .where({ 'client_profiles.user_id': user_id })
      .first(),
};


module.exports = ClientProfile;
