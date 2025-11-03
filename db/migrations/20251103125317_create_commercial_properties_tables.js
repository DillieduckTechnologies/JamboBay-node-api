exports.up = function (knex) {
  return knex.schema.createTable("commercial_properties", function (table) {
    table.increments("id").primary();

    table.string("name", 255).notNullable();
    table.string("category", 50).notNullable();
    table.text("description").nullable();

    table.string("physical_address", 255).notNullable();
    table.string("address", 255).nullable();
    table.string("city", 100).nullable();
    table.string("county", 100).nullable();
    table.string("sub_county", 100).nullable();
    table.string("ward", 100).nullable();
    table.string("postal_code", 20).nullable();

    table.decimal("latitude", 9, 6).nullable();
    table.decimal("longitude", 9, 6).nullable();
    table.boolean("auto_geocode").defaultTo(true);

    table.decimal("size_sqft", 12, 2).nullable();
    table.decimal("price", 15, 2).notNullable();
    table.date("available_from").defaultTo(knex.fn.now());
    table.boolean("is_available").defaultTo(true);

    table
      .integer("company_id")
      .unsigned()
      .references("id")
      .inTable("companies")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table
      .integer("agent_id")
      .unsigned()
      .references("id")
      .inTable("agents")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table
      .integer("added_by")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("commercial_properties");
};
