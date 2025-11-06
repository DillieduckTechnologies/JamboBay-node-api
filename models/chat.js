const db = require('../db/connection');
const { DateTime } = require("luxon");

const Chat = {
  async create({ agent_id, client_id, property_id, property_type }) {
    const existing = await db("chats")
      .where({ agent_id, client_id, property_id, property_type })
      .first();

    if (existing) return existing; // prevent duplicates

    const [chat] = await db("chats")
      .insert({
        agent_id,
        client_id,
        property_id,
        property_type,
        status: "active",
        archived: false,
        is_deleted: false,
        created_at: DateTime.now().toISO(),
      })
      .returning("*");

    return chat;
  },

  async findById(id) {
    return db("chats").where({ id }).first();
  },

  async findByAgent(agent_id) {
    return db("chats").where({ agent_id }).orderBy("created_at", "desc");
  },

  async findByClient(client_id) {
    return db("chats").where({ client_id }).orderBy("created_at", "desc");
  },

  async archive(id) {
    return db("chats")
      .where({ id })
      .update({ archived: true, archived_at: DateTime.now().toISO() });
  },

  async unarchive(id) {
    return db("chats")
      .where({ id })
      .update({ archived: false, archived_at: null });
  },

  async softDelete(id) {
    return db("chats")
      .where({ id })
      .update({ is_deleted: true, deleted_at: DateTime.now().toISO() });
  },
};

module.exports = Chat;
