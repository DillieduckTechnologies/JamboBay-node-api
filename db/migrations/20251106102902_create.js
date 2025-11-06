exports.up = function (knex) {
  return knex.schema
    // --- Mortgage Providers Table ---
    .createTable('mortgage_providers', function (table) {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('contact_email', 255).notNullable();
      table.string('phone_number', 50).notNullable();
      table.string('website', 255).nullable();
      table.string('address', 255).notNullable();
      table.boolean('verified').defaultTo(false);

      // Admin who added the provider (optional)
      table
        .integer('added_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');

      table.timestamp('created_at').defaultTo(knex.fn.now());
    })

    // --- Mortgage Applications Table ---
    .createTable('mortgage_applications', function (table) {
      table.increments('id').primary();

      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .comment('Client ID from client_profiles or users');

      table
        .integer('property_id')
        .unsigned()
        .notNullable()
        .comment('Property ID from residential or commercial properties');

      // Add property_type to distinguish property source
      table
        .enu('property_type', ['residential', 'commercial'])
        .notNullable()
        .comment('Indicates which property table this application relates to');

      table
        .integer('provider_id')
        .unsigned()
        .references('id')
        .inTable('mortgage_providers')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      table.decimal('amount_requested', 15, 2).notNullable();
      table.integer('repayment_period_years').unsigned().notNullable();
      table.decimal('monthly_income', 15, 2).notNullable();

      table
        .enu('status', ['pending', 'under_review', 'approved', 'rejected'])
        .defaultTo('pending');

      table.text('notes').nullable();

      table.timestamp('submitted_at').defaultTo(knex.fn.now());
      table.timestamp('reviewed_at').nullable();

      table
        .integer('reviewed_by')
        .unsigned()
        .nullable()
        .comment('Admin or provider user ID who reviewed the application');

      table.comment('Mortgage applications linked to residential or commercial properties');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('mortgage_applications')
    .dropTableIfExists('mortgage_providers');
};
