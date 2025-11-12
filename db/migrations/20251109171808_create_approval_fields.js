exports.up = async function (knex) {
  // Residential Properties
  await knex.schema.table('residential_properties', function (table) {
    table.string('status', 20).defaultTo('pending');
    table.boolean('approved').defaultTo(false);
    table.timestamp('approved_at').nullable();
    table.integer('approved_by').unsigned().nullable()
      .references('id').inTable('users').onDelete('SET NULL');
    table.text('rejection_reason').nullable();
  });

  // Commercial Properties
  await knex.schema.table('commercial_properties', function (table) {
    table.string('status', 20).defaultTo('pending');
    table.boolean('approved').defaultTo(false);
    table.timestamp('approved_at').nullable();
    table.integer('approved_by').unsigned().nullable()
      .references('id').inTable('users').onDelete('SET NULL');
    table.text('rejection_reason').nullable();
  });

  // Agents — only add verified_at
  const hasVerifiedAt = await knex.schema.hasColumn('agents', 'verified_at');
  if (!hasVerifiedAt) {
    await knex.schema.table('agents', function (table) {
      table.timestamp('verified_at').nullable();
    });
  }

  // Companies — only add verification_notes if not exist
  const hasVerificationNotes = await knex.schema.hasColumn('companies', 'verification_notes');
  if (!hasVerificationNotes) {
    await knex.schema.table('companies', function (table) {
      table.text('verification_notes').nullable();
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.table('residential_properties', function (table) {
    table.dropColumn('status');
    table.dropColumn('approved');
    table.dropColumn('approved_at');
    table.dropColumn('approved_by');
    table.dropColumn('rejection_reason');
  });

  await knex.schema.table('commercial_properties', function (table) {
    table.dropColumn('status');
    table.dropColumn('approved');
    table.dropColumn('approved_at');
    table.dropColumn('approved_by');
    table.dropColumn('rejection_reason');
  });

  const hasVerifiedAt = await knex.schema.hasColumn('agents', 'verified_at');
  if (hasVerifiedAt) {
    await knex.schema.table('agents', function (table) {
      table.dropColumn('verified_at');
    });
  }

  const hasVerificationNotes = await knex.schema.hasColumn('companies', 'verification_notes');
  if (hasVerificationNotes) {
    await knex.schema.table('companies', function (table) {
      table.dropColumn('verification_notes');
    });
  }
};
