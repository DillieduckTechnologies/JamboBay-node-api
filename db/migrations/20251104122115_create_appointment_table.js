/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('appointment', (table) => {
    table.increments('id').primary();

    // Relationships
    table
      .integer('client_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('client_profiles')
      .onDelete('CASCADE');

    table
      .integer('agent_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('agents')
      .onDelete('CASCADE');

    // Property reference (one of the two)
    table
      .integer('property_id')
      .unsigned()
      .notNullable()
      .comment('ID of property in either residential_properties or commercial_properties');

    table
      .enu('property_type', ['residential', 'commercial'])
      .notNullable()
      .comment('Indicates which table the property belongs to');

    // Appointment details
    table.date('appointment_date').notNullable();
    table.time('appointment_time').notNullable();

    table
      .enu('status', [
        'pending',
        'approved',
        'rejected',
        'completed',
        'cancelled'
      ])
      .defaultTo('pending');

    table.text('notes').nullable();

    // Timestamps
    table
      .timestamp('created_at', { useTz: true })
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at', { useTz: true })
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('appointment');
};
