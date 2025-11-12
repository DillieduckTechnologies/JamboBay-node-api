const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /approvals/update:
 *   post:
 *     summary: Approve or reject an entity (agent, company, residential or commercial property)
 *     tags: [Approvals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - id
 *               - action
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [agent, company, residential, commercial]
 *                 example: agent
 *                 description: The type of entity to approve or reject.
 *               id:
 *                 type: integer
 *                 example: 2
 *                 description: The ID of the entity being updated.
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *                 example: approve
 *                 description: The action to perform (approve or reject).
 *               reason:
 *                 type: string
 *                 example: "Incomplete documents"
 *                 description: Reason for rejection (required only when action = reject).
 *               notes:
 *                 type: string
 *                 example: "Verified all submitted information."
 *                 description: Optional notes for verification (used mainly for companies).
 *     responses:
 *       200:
 *         description: Entity approval updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "agent approved successfully"
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 status:
 *                   type: string
 *                   example: "approved"
 *       400:
 *         description: Invalid input or action
 *       403:
 *         description: Only admins can perform approvals
 *       404:
 *         description: Entity not found
 */
router.post('/update', verifyToken, approvalController.updateApproval);

module.exports = router;
