const db = require('../db/connection');

const ClientProfile = {
  create: (profile) => db('client_profiles').insert(profile).returning('*'),

  update: (user_id, data) =>
    db('client_profiles').where({ user_id }).update(data).returning('*'),

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
