exports.up = function (knex) {
  return knex.schema.createTable('residential_properties', function (table) {
    table.increments('id').primary()

    table.string('name', 255).notNullable()
    table
      .enu('category', ['apartment', 'house', 'villa', 'studio'], {
        useNative: true,
        enumName: 'residential_category',
      })
      .notNullable()

    table
      .enu('listing_type', ['rent', 'sale'], {
        useNative: true,
        enumName: 'listing_type_enum',
      })
      .notNullable()

    table.text('description').nullable()
    table.string('physical_address', 255).notNullable()
    table.string('city', 100).notNullable()
    table.string('county', 100).nullable()
    table.float('gps_latitude').nullable()
    table.float('gps_longitude').nullable()

    table.decimal('price', 12, 2).notNullable()
    table.integer('bedrooms').defaultTo(0)
    table.integer('bathrooms').defaultTo(0)
    table.integer('size_sqft').nullable()
    table.date('available_from').nullable()
    table.boolean('is_available').defaultTo(true)

    table
      .integer('company_id')
      .unsigned()
      .references('id')
      .inTable('companies')
      .onDelete('SET NULL')
      .nullable()

    table
      .integer('agent_id')
      .unsigned()
      .references('id')
      .inTable('agents')
      .onDelete('SET NULL')
      .nullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('residential_properties')
    .raw('DROP TYPE IF EXISTS residential_category')
    .raw('DROP TYPE IF EXISTS listing_type_enum')
}
