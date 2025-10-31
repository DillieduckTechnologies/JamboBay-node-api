const db = require('../db/connection');

const ClientProfile = {
  create: (profile) => db('client_profiles').insert(profile).returning('*'),

  update: (user_id, data) =>
    db('client_profiles').where({ user_id }).update(data).returning('*'),

  findByUserId: (user_id) => db('client_profiles').where({ user_id }).first(),
};

module.exports = ClientProfile;
