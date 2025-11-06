/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('property_viewings', (table) => {
    table.increments('id').primary();
    table.integer('property_id').notNullable();
    table
      .enu('property_type', ['residential', 'commercial'])
      .notNullable()
      .comment('Indicates whether the property is from residential_properties or commercial_properties');

    table.integer('client_id').notNullable().comment('Client ID from Auth Service');
    table.integer('agent_id').notNullable().comment('Agent ID from Auth Service');
    table.timestamp('scheduled_date').notNullable();

    table
      .enu('status', ['pending', 'confirmed', 'cancelled', 'completed'])
      .defaultTo('pending');

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('property_viewings');
};
