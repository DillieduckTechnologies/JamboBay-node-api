exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table.string('password_reset_token').nullable();
    table.timestamp('password_reset_expires').nullable();
    table.boolean('is_verified').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('password_reset_token');
    table.dropColumn('password_reset_expires');
    table.dropColumn('is_verified');
  });
};
