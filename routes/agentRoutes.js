const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Agent management endpoints
 */

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Get all agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: List of agents
 */
router.get('/', verifyToken, agentController.getAgents);

/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     summary: Get an agent by ID
 *     tags: [Agents]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agent details
 *       404:
 *         description: Agent not found
 */
router.get('/:id', verifyToken, agentController.getAgentById);

/**
 * @swagger
 * /agents/create:
 *   post:
 *     summary: Register a new agent
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id_document
 *               - earb_certificate_file
 *               - id_or_passport_number
 *               - earb_certificate_serial_number
 *             properties:
 *               id_or_passport_number:
 *                 type: string
 *               id_document:
 *                 type: string
 *                 format: binary
 *               physical_address:
 *                 type: string
 *               office_address:
 *                 type: string
 *               earb_certificate_serial_number:
 *                 type: string
 *               earb_issued_date:
 *                 type: string
 *                 format: date
 *               earb_certificate_file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Agent created successfully
 */
router.post(
  '/create',
  verifyToken,
  upload.fields([
    { name: 'id_document', maxCount: 1 },
    { name: 'earb_certificate_file', maxCount: 1 }
  ]),
  agentController.createAgent
);


/**
 * @swagger
 * /agents/update/{id}:
 *   put:
 *     summary: Update an agent's details
 *     description: Allows an authenticated user to update an existing agent record by ID.
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []     # JWT token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the agent to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id_or_passport_number:
 *                 type: string
 *                 example: "A12345678"
 *               id_document:
 *                 type: string
 *                 format: binary
 *                 description: Upload the ID or passport document file
 *               physical_address:
 *                 type: string
 *                 example: "123 Nairobi Street"
 *               office_address:
 *                 type: string
 *                 example: "Westlands Office Park"
 *               earb_certificate_serial_number:
 *                 type: string
 *                 example: "EARB-2025-001"
 *               earb_issued_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-10"
 *               earb_certificate_file:
 *                 type: string
 *                 format: binary
 *                 description: Upload the EARB certificate file
 *               earb_verified:
 *                 type: boolean
 *                 example: false
 *               verified:
 *                 type: boolean
 *                 example: true
 *               verified_by:
 *                 type: integer
 *                 example: 3
 *               verification_notes:
 *                 type: string
 *                 example: "Documents verified successfully"
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agent updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Agent not found
 */
router.put('/update/:id', verifyToken, upload.fields([
  { name: 'id_document', maxCount: 1 },
  { name: 'earb_certificate_file', maxCount: 1 }
]), agentController.updateAgent);

/**
 * @swagger
 * /agents/delete/{id}:
 *   delete:
 *     summary: Delete an agent
 *     tags: [Agents]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 */
router.delete('/delete/:id', verifyToken, agentController.deleteAgent);

module.exports = router;
