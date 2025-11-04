exports.up = function (knex) {
  return knex.schema.createTable('commercial_property_images', function (table) {
    table.increments('id').primary()

    table
      .integer('property_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('commercial_properties')
      .onDelete('CASCADE')

    table.string('image', 255).notNullable()
    table.string('caption', 255).nullable()
    table.boolean('is_primary').defaultTo(false)
    table.timestamp('uploaded_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('commercial_property_images')
}
