const Message = require("../models/message");
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const logger = require('../utils/logger');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { chat_id, sender_id, content, attachment } = req.body;

    if (!chat_id || !sender_id || !content) {
      return res.json(errorResponse("Missing fields!", "Missing required fields.", 400));
    }

    const message = await Message.create({ chat_id, sender_id, content, attachment });
    return res.json(successResponse("Message sent successfully", message, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Get messages in chat
exports.getMessagesByChat = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const messages = await Message.findByChat(chat_id);
    return res.json(successResponse("Messages retrieved successfully", messages, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.markAsRead(id);
    return res.json(successResponse("Message marked as read", null, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
