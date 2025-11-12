exports.up = function (knex) {
  return knex.schema.alterTable('companies', (table) => {
    table
      .integer('verified_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('companies', (table) => {
    table.dropColumn('verified_by');
  });
};
