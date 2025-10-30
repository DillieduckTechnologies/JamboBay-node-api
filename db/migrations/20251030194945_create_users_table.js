/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('password', 128).notNullable();
    table.timestamp('last_login').nullable();
    table.boolean('is_superuser').defaultTo(false);
    table.string('username', 150).notNullable().unique();
    table.string('first_name', 150).defaultTo('');
    table.string('last_name', 150).defaultTo('');
    table.string('email', 254).defaultTo('');
    table.boolean('is_staff').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('date_joined').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
