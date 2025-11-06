/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('purchase_applications', (table) => {
    // Ensure client_id references client_profiles
    table
      .integer('client_id')
      .unsigned()
      .references('id')
      .inTable('client_profiles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .alter();

    // Ensure reviewed_by references users
    table
      .integer('reviewed_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')
      .alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('purchase_applications', (table) => {
    table.dropForeign(['client_id']);
    table.dropForeign(['reviewed_by']);
  });
};
