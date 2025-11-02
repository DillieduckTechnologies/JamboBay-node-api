exports.up = function(knex) {
  return knex.schema.createTable('agent_references', function(table) {
    table.increments('id').primary()

    table
      .integer('agent_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('agents')
      .onDelete('CASCADE')

    table.string('name', 255).notNullable()
    table.string('contact', 50).notNullable()
    table.string('relationship', 100).nullable()
    table.boolean('verified').defaultTo(false)
    table.timestamp('verified_at').nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())

    table.unique(['agent_id', 'contact'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('agent_references')
}
