/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('purchase_applications', (table) => {
    table.increments('id').primary();
    table
      .enum('property_type', ['residential', 'commercial'])
      .notNullable()
      .comment('Indicates whether the property is residential or commercial');
    table.integer('property_id').notNullable().comment('Property ID from property service');
    table.integer('client_id').notNullable().comment('Client ID from client service');
    table.decimal('offer_price', 15, 2).notNullable();
    table.text('remarks').nullable();
    table
      .enum('status', ['pending', 'approved', 'rejected'])
      .defaultTo('pending')
      .notNullable();
    table.timestamp('applied_at').defaultTo(knex.fn.now());
    table.timestamp('reviewed_at').nullable();
    table
      .integer('reviewed_by')
      .nullable()
      .comment('Agent/Company ID from auth service');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('purchase_applications');
};
