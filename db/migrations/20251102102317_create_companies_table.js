exports.up = function(knex) {
  return knex.schema.createTable('companies', function(table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable().unique();
    table.string('registration_number', 100).notNullable().unique();
    table.string('email', 255).nullable();
    table.string('phone', 50).nullable();
    table.string('address', 255).nullable();
    table.string('logo', 255).nullable(); // path to logo (e.g., uploads/companies/logos/logo.png)
    table.string('website', 255).nullable();

    table.boolean('verified').defaultTo(false);
    table.timestamp('verified_at').nullable();

    // Foreign key to users table
    table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('companies');
};
