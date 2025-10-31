// seeds/seed_user_types.js
exports.seed = async function (knex) {
  await knex('user_types').del();

  await knex('user_types').insert([
    { name: 'superuser', description: 'Full access to the system' },
    { name: 'admin', description: 'Manage users and configurations' },
    { name: 'staff', description: 'Internal staff member' },
    { name: 'client', description: 'External user or customer' },
     { name: 'agent', description: 'Agent' },
     { name: 'company', description: 'Company' },
  ]);
};
