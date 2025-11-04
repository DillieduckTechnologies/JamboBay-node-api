exports.up = function (knex) {
  return knex.schema.alterTable('residential_properties', function (table) {
    table.string('sub_county', 100).nullable();
    table.string('ward', 100).nullable();
    table.string('postal_code', 20).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('residential_properties', function (table) {
    table.dropColumn('sub_county');
    table.dropColumn('ward');
    table.dropColumn('postal_code');
  });
};
