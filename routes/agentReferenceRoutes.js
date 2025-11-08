const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const agentReferenceController = require('../controllers/agentReferenceController');

/**
 * @swagger
 * tags:
 *   name: Agent References
 *   description: Manage agent reference records
 */

/**
 * @swagger
 * /agent-references/create:
 *   post:
 *     summary: Create a new agent reference
 *     tags: [Agent References]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agent_id:
 *                 type: integer
 *                 example: 2
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               contact:
 *                 type: string
 *                 example: "+254712345678"
 *               relationship:
 *                 type: string
 *                 example: "Former Employer"
 *     responses:
 *       201:
 *         description: Agent reference created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/create', verifyToken, agentReferenceController.createReference);

/**
 * @swagger
 * /agent-references/{id}:
 *   get:
 *     summary: Get an agent reference by ID
 *     tags: [Agent References]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agent reference ID
 *     responses:
 *       200:
 *         description: Successful fetch
 *       404:
 *         description: Reference not found
 */
router.get('/:id', verifyToken, agentReferenceController.getReferenceById);

/**
 * @swagger
 * /agent-references/agent/{agent_id}:
 *   get:
 *     summary: Get all references for an agent
 *     tags: [Agent References]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agent_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Successful fetch
 */
router.get('/agent/:agent_id', verifyToken, agentReferenceController.getReferencesByAgent);

/**
 * @swagger
 * /agent-references/update/{id}:
 *   put:
 *     summary: Update an agent reference
 *     tags: [Agent References]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the agent reference to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               contact:
 *                 type: string
 *                 example: "+254798765432"
 *               relationship:
 *                 type: string
 *                 example: "Supervisor"
 *               verified:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Reference updated successfully
 *       404:
 *         description: Reference not found
 */
router.put('/update/:id', verifyToken, agentReferenceController.updateReference);

/**
 * @swagger
 * /agent-references/delete/{id}:
 *   delete:
 *     summary: Delete an agent reference
 *     tags: [Agent References]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the agent reference
 *     responses:
 *       200:
 *         description: Reference deleted successfully
 *       404:
 *         description: Reference not found
 */
router.delete('/delete/:id', verifyToken, agentReferenceController.deleteReference);

module.exports = router;
