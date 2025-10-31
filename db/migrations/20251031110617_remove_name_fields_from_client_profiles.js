/**
 * @param { import("knex").Knex } knex
 */

exports.up = async function (knex) {
  await knex.schema.alterTable('client_profiles', (table) => {
    table.dropColumn('first_name');
    table.dropColumn('middle_name');
    table.dropColumn('last_name');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('client_profiles', (table) => {
    table.string('first_name', 100);
    table.string('middle_name', 100).nullable();
    table.string('last_name', 100);
  });
};
