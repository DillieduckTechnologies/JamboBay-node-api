exports.up = function (knex) {
  return knex.schema.alterTable('commercial_properties', function (table) {
    table.dropColumn('auto_geocode');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('commercial_properties', function (table) {
    table.boolean('auto_geocode').defaultTo(true);
  });
};
