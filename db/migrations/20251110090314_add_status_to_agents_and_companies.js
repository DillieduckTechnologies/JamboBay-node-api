exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable('agents', (table) => {
      table.string('status', 50).defaultTo('pending');
    }),
    knex.schema.alterTable('companies', (table) => {
      table.string('status', 50).defaultTo('pending');
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable('agents', (table) => {
      table.dropColumn('status');
    }),
    knex.schema.alterTable('companies', (table) => {
      table.dropColumn('status');
    }),
  ]);
};
