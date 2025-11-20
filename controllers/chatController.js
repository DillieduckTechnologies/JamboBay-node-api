const Chat = require("../models/chat");
const {sendChatInitiatedEmail} = require("../helpers/mailHelper");
const { cli } = require("winston/lib/winston/config");
const User = require("../models/user");
const ResidentialProperty = require("../models/residentialProperty");
const CommercialProperty = require("../models/commercialProperty");
const Agent = require("../models/agent");
const Client = require("../models/clientProfile");
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// Agent initiates a chat with a client about a property
exports.startChat = async (req, res) => {
  try {
    const { agent_id, client_id, property_id, property_type } = req.body;

    //only agent initiate chat
    console.log(req.user.role.name);
    if (req.user.role.name !== 'agent') {
        return res.status(403).json({ message: "Only agents can initiate chats." });
        }
    if (!agent_id || !client_id || !property_id || !property_type) {
      return res.status(400).json({ message: "Missing required fields." });
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
        return res.status(400).json({ message: "Invalid property type." });
    }
    const property = await model.findById(property_id);
    if (!property) {
        return res.status(404).json({ message: "Property not found." });
    }

    // Send email notification to client
    const chatUrl = `${process.env.FRONTEND_URL}chats/${chat.id}`;
    console.log(client.email, client.first_name + ' ' + client.last_name, agent.first_name + ' ' + agent.last_name, property.name, chatUrl);
    await sendChatInitiatedEmail(
      client.email,
      client.first_name + ' ' + client.last_name,
      agent.first_name + ' ' + agent.last_name,
      property.name,
      chatUrl
    );

    
    res.status(201).json({ message: "Chat started successfully.", data: chat });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ message: "Error starting chat", error: error.message });
  }
};

// Fetch all chats for an agent
exports.getChatsByAgent = async (req, res) => {
  try {
    const { agent_id } = req.params;
    const chats = await Chat.findByAgent(agent_id);
    res.json({ data: chats });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error: error.message });
  }
};

// Fetch all chats for a client
exports.getChatsByClient = async (req, res) => {
  try {
    const { client_id } = req.params;
    const chats = await Chat.findByClient(client_id);
    res.json({ data: chats });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error: error.message });
  }
};

// Archive chat
exports.archiveChat = async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.archive(id);
    res.json({ message: "Chat archived successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error archiving chat", error: error.message });
  }
};

// Unarchive chat
exports.unarchiveChat = async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.unarchive(id);
    res.json({ message: "Chat unarchived successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error unarchiving chat", error: error.message });
  }
};

// Soft delete
exports.deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.softDelete(id);
    res.json({ message: "Chat deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting chat", error: error.message });
  }
};
