const db = require('../db/connection');
const { DateTime } = require("luxon");

const Message = {
  async create({ chat_id, sender_id, content, attachment = null }) {
    const [message] = await db("messages")
      .insert({
        chat_id,
        sender_id,
        content,
        attachment,
        is_read: false,
        timestamp: DateTime.now().toISO(),
      })
      .returning("*");

    return message;
  },

  async findByChat(chat_id) {
    return db("messages").where({ chat_id }).orderBy("timestamp", "asc");
  },

  async markAsRead(id) {
    return db("messages")
      .where({ id })
      .update({ is_read: true, read_at: DateTime.now().toISO() });
  },
};

module.exports = Message;
