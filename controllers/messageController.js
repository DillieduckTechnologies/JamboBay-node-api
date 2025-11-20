const Message = require("../models/message");
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { chat_id, sender_id, content, attachment } = req.body;

    if (!chat_id || !sender_id || !content) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const message = await Message.create({ chat_id, sender_id, content, attachment });
    res.status(201).json({ message: "Message sent successfully.", data: message });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// Get messages in chat
exports.getMessagesByChat = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const messages = await Message.findByChat(chat_id);
    res.json({ data: messages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.markAsRead(id);
    res.json({ message: "Message marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Error marking as read", error: error.message });
  }
};
