exports.up = function (knex) {
  return knex.schema.alterTable('residential_properties', function (table) {
    // 1️⃣ Rename GPS columns
    table.renameColumn('gps_latitude', 'latitude');
    table.renameColumn('gps_longitude', 'longitude');

    // 2️⃣ Add added_by foreign key
    table
      .integer('added_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('residential_properties', function (table) {
    // Revert the changes
    table.renameColumn('latitude', 'gps_latitude');
    table.renameColumn('longitude', 'gps_longitude');
    table.dropColumn('added_by');
  });
};
