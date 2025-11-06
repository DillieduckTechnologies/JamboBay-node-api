const Chat = require("../models/chat");
const Message = require("../models/message");

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
