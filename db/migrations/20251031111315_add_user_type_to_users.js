// migrations/XXXXXXXXXXXX_add_user_type_to_users.js

exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table
      .integer('user_type_id')
      .unsigned()
      .references('id')
      .inTable('user_types')
      .onDelete('SET NULL');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('user_type_id');
  });
};
