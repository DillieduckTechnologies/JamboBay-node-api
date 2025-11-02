exports.up = function(knex) {
  return knex.schema.createTable('agents', function(table) {
    table.increments('id').primary();

    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.string('id_or_passport_number', 100).notNullable().unique();
    table.string('id_document', 255).notNullable();

    table.string('physical_address', 255).notNullable();
    table.string('office_address', 255).notNullable();

    table.string('earb_certificate_serial_number', 100).notNullable().unique();
    table.date('earb_issued_date').notNullable();
    table.string('earb_certificate_file', 255).notNullable();
    table.boolean('earb_verified').defaultTo(false);
    table.timestamp('earb_verified_at').nullable();

    table.boolean('verified').defaultTo(false);
    table.integer('verified_by').unsigned()
      .references('id').inTable('users')
      .onDelete('SET NULL');
    table.text('verification_notes').nullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('agents');
};
