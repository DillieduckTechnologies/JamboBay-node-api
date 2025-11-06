// migrations/xxxx_create_chats_and_messages.js
exports.up = function (knex) {
  return knex.schema
    .createTable('chats', function (table) {
      table.increments('id').primary();

      // Both client and agent come from users table
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      table
        .integer('agent_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      table.integer('property_id').notNullable();
      table
        .enu('property_type', ['residential', 'commercial'])
        .notNullable()
        .comment('Indicates which property table this chat is related to');

      table.string('status', 20).defaultTo('active');
      table.boolean('archived').defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.boolean('is_deleted').defaultTo(false);
      table.timestamp('deleted_at').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.unique(['client_id', 'agent_id', 'property_id', 'property_type']);
    })
    .createTable('messages', function (table) {
      table.increments('id').primary();

      table
        .integer('chat_id')
        .unsigned()
        .references('id')
        .inTable('chats')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      // Sender always comes from users
      table
        .integer('sender_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      table.text('content').notNullable();
      table.string('attachment').nullable();
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.boolean('is_read').defaultTo(false);
      table.timestamp('read_at').nullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('messages').dropTableIfExists('chats');
};
