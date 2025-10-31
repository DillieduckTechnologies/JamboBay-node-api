exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('is_superuser');
    table.dropColumn('is_staff');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
    table.boolean('is_superuser').defaultTo(false);
    table.boolean('is_staff').defaultTo(false);
  });
};
