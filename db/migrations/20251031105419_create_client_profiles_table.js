exports.up = function (knex) {
  return knex.schema.createTable('client_profiles', (table) => {
    table.increments('id').primary();

    // Foreign key to users
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.string('first_name').notNullable();
    table.string('middle_name');
    table.string('last_name').notNullable();
    table.string('id_or_passport_number').unique().notNullable();
    table.string('phone_number').notNullable();
    table.date('date_of_birth').notNullable();
    table.string('gender').notNullable();
    table.string('profile_photo');
    table.string('physical_address').notNullable();
    table.string('city').notNullable();
    table.string('county').notNullable();

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('client_profiles');
};
