exports.up = async function (knex) {
  // 🟢 ALTER CHATS TABLE
  await knex.schema.alterTable('chats', function (table) {
    // Drop existing foreign key constraints (if referencing users)
    table.dropForeign('client_id');
    table.dropForeign('agent_id');

    // Re-add with correct references
    table
      .integer('client_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('client_profiles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .alter();

    table
      .integer('agent_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('agents')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .alter();
  });
};

exports.down = async function (knex) {
  // 🔴 Revert back to referencing users table if needed
  await knex.schema.alterTable('chats', function (table) {
    table.dropForeign('client_id');
    table.dropForeign('agent_id');

    table
      .integer('client_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .alter();

    table
      .integer('agent_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .alter();
  });
};
