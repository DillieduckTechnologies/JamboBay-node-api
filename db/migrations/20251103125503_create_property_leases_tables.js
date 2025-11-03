exports.up = function (knex) {
  return knex.schema.createTable('property_leases', (table) => {
    table.increments('id').primary();

    table.integer('residential_property_id').unsigned().nullable()
      .references('id').inTable('residential_properties')
      .onDelete('CASCADE');

    table.integer('commercial_property_id').unsigned().nullable()
      .references('id').inTable('commercial_properties')
      .onDelete('CASCADE');

    table.integer('client_profile_id').unsigned().notNullable()
      .references('id').inTable('client_profiles')
      .onDelete('CASCADE');

    table.date('lease_start_date').notNullable();
    table.date('lease_end_date').notNullable();
    table.decimal('monthly_rent', 12, 2).notNullable();
    table.string('payment_frequency', 20).defaultTo('monthly');
    table.text('special_requests').nullable();

    table.enu('status', ['pending', 'approved', 'rejected']).defaultTo('pending');
    table.timestamp('applied_at').defaultTo(knex.fn.now());
    table.timestamp('reviewed_at').nullable();
    table.integer('reviewed_by').nullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('property_leases');
};
