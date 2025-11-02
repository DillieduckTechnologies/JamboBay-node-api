exports.up = function(knex) {
  return knex.schema.createTable('company_memberships', function(table) {
    table.increments('id').primary()
    table
      .integer('agent_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('agents')
      .onDelete('CASCADE')

    table
      .integer('company_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('companies')
      .onDelete('CASCADE')

    table
      .enum('status', ['pending', 'approved', 'rejected'])
      .defaultTo('pending')

    table.timestamp('requested_at').defaultTo(knex.fn.now())
    table.timestamp('decided_at').nullable()

    table
      .integer('decided_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')

    table.unique(['agent_id', 'company_id'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('company_memberships')
}
