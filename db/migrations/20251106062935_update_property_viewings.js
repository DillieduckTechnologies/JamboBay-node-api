/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('property_viewings', (table) => {
    // only alter existing columns — do NOT try to add them
    table
      .integer('client_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('client_profiles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .alter();

    table
      .integer('agent_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('agents')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('property_viewings', (table) => {
    table.dropForeign(['client_id']);
    table.dropForeign(['agent_id']);
  });
};
