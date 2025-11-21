const Chat = require("../models/chat");
const { sendChatInitiatedEmail } = require("../helpers/mailHelper");
const { cli } = require("winston/lib/winston/config");
const User = require("../models/user");
const ResidentialProperty = require("../models/residentialProperty");
const CommercialProperty = require("../models/commercialProperty");
const Agent = require("../models/agent");
const Client = require("../models/clientProfile");
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const logger = require('../utils/logger');


// Agent initiates a chat with a client about a property
exports.startChat = async (req, res) => {
  try {
    const { agent_id, client_id, property_id, property_type } = req.body;

    //only agent initiate chat
    if (req.user.role !== 'agent') {
      return res.json(errorResponse("Unauthorized!", "Only agents can initiate chats.", 403));
    }
    if (!agent_id || !client_id || !property_id || !property_type) {
      return res.json(errorResponse("Missing fields!", "Missing required fields..", 400));
    }

    const chat = await Chat.create({ agent_id, client_id, property_id, property_type });
    // Fetch agent and client details for email
    const agentProfile = await Agent.findById(agent_id);
    const clientProfile = await Client.findById(client_id);
    const agent = await User.findById(agentProfile.user_id);
    const client = await User.findById(clientProfile.user_id);
    let model = null;
    if (property_type === 'residential') {
      model = ResidentialProperty;
    } else if (property_type === 'commercial') {
      model = CommercialProperty;
    } else {
      return res.json(errorResponse("Invalid Property Type!", "Invalid property type.", 400));
    }
    const property = await model.findById(property_id);
    if (!property) {
      return res.json(errorResponse("Not found!", "Property not found.", 404));
    }

    // Send email notification to client
    const chatUrl = `${process.env.FRONTEND_URL}chats/${chat.id}`;
    console.log(client.email, client.first_name + ' ' + client.last_name, agent.first_name + ' ' + agent.last_name, property.name, chatUrl);
    sendChatInitiatedEmail(
      client.email,
      client.first_name + ' ' + client.last_name,
      agent.first_name + ' ' + agent.last_name,
      property.name,
      chatUrl
    );


    return res.json(successResponse("Chat started successfully", chat, 201));
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Fetch all chats for an agent
exports.getChatsByAgent = async (req, res) => {
  try {
    const { agent_id } = req.params;
    const chats = await Chat.findByAgent(agent_id);
    return res.json(successResponse("Agent Chats retrieved successfully", chats, 200));
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Fetch all chats for a client
exports.getChatsByClient = async (req, res) => {
  try {
    const { client_id } = req.params;
    const chats = await Chat.findByClient(client_id);
    return res.json(successResponse("Client Chats retrieved successfully", chats, 200));
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Archive chat
exports.archiveChat = async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.archive(id);
    return res.json(successResponse("Chat archived successfully", null, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Unarchive chat
exports.unarchiveChat = async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.unarchive(id);
    return res.json(successResponse("Chat unarchived successfully", null, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Soft delete
exports.deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.softDelete(id);
    return res.json(successResponse("Chat deleted successfully", null, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
