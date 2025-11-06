const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const messageController = require("../controllers/messageController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Chat and messaging between agents and clients
 */

/**
 * @swagger
 * /chats/initiate:
 *   post:
 *     summary: Start a new chat (agent initiates)
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agent_id
 *               - client_id
 *               - property_id
 *             properties:
 *               agent_id:
 *                 type: integer
 *                 example: 4
 *               client_id:
 *                 type: integer
 *                 example: 102
 *               property_id:
 *                 type: integer
 *                 example: 35
 *     responses:
 *       201:
 *         description: Chat created successfully
 *       400:
 *         description: Chat already exists or invalid data
 */
router.post("/initiate", verifyToken, chatController.startChat);

/**
 * @swagger
 * /chats/agent/{agent_id}:
 *   get:
 *     summary: Get all chats for a specific agent
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agent_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of agent's chats
 */
router.get("/agent/:agent_id", verifyToken, chatController.getChatsByAgent);

/**
 * @swagger
 * /chats/client/{client_id}:
 *   get:
 *     summary: Get all chats for a specific client
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of client's chats
 */
router.get("/client/:client_id", verifyToken, chatController.getChatsByClient);

/**
 * @swagger
 * /chats/{id}/archive:
 *   put:
 *     summary: Archive a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat archived successfully
 */
router.put("/:id/archive", verifyToken, chatController.archiveChat);

/**
 * @swagger
 * /chats/{id}/unarchive:
 *   put:
 *     summary: Unarchive a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat unarchived successfully
 */
router.put("/:id/unarchive", verifyToken, chatController.unarchiveChat);

/**
 * @swagger
 * /chats/delete/{id}:
 *   delete:
 *     summary: Soft delete a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat deleted successfully
 */
router.delete("/delete/:id", verifyToken, chatController.deleteChat);

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Manage messages within a chat
 */

/**
 * @swagger
 * /chats/messages/send:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chat_id
 *               - sender_id
 *               - content
 *             properties:
 *               chat_id:
 *                 type: integer
 *                 example: 12
 *               sender_id:
 *                 type: integer
 *                 example: 4
 *               content:
 *                 type: string
 *                 example: "Hello, I’m interested in the property"
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post("/messages/send", verifyToken, messageController.sendMessage);

/**
 * @swagger
 * /chats/{chat_id}/messages:
 *   get:
 *     summary: Get all messages in a chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chat_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of messages in the chat
 */
router.get("/:chat_id/messages", verifyToken, messageController.getMessagesByChat);

/**
 * @swagger
 * /chats/messages/{id}/read:
 *   put:
 *     summary: Mark a message as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message marked as read
 */
router.put("/messages/:id/read", verifyToken, messageController.markAsRead);

module.exports = router;
