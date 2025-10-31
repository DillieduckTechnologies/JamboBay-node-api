
exports.up = function (knex) {
  return knex.schema.createTable('user_types', (table) => {
    table.increments('id').primary();
    table.string('name').unique().notNullable(); // e.g. 'admin', 'client'
    table.string('description').nullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_types');
};
