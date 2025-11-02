const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const companyMembershipController = require('../controllers/companyMembershipController');

/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyMembership:
 *       type: object
 *       properties:
 *         agent_id:
 *           type: integer
 *           example: 3
 *         company_id:
 *           type: integer
 *           example: 2
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: "pending"
 *         requested_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /company-memberships:
 *   get:
 *     summary: Get all company memberships
 *     tags: [CompanyMembership]
 */
router.get('/', verifyToken, companyMembershipController.getMemberships);

/**
 * @swagger
 * /company-memberships/{id}:
 *   get:
 *     summary: Get a company membership by ID
 *     tags: [CompanyMembership]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 */
router.get('/:id', verifyToken, companyMembershipController.getMembershipById);

/**
 * @swagger
 * /company-memberships/create:
 *   post:
 *     summary: Create a new company membership
 *     tags: [CompanyMembership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyMembership'
 */
router.post('/create', verifyToken, companyMembershipController.createMembership);

/**
 * @swagger
 * /company-memberships/update/{id}:
 *   put:
 *     summary: Update a company membership status
 *     description: Allows an admin or authorized user to update the status (approved/rejected) of a company membership.
 *     tags: [CompanyMembership]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Membership ID to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Membership updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Membership status updated successfully
 *                 data:
 *                   type: object
 *                   example:
 *                     id: 1
 *                     agent_id: 3
 *                     company_id: 2
 *                     status: approved
 *                     decided_at: 2025-10-30T10:00:00Z
 *       400:
 *         description: Invalid status or request data
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Server error
 */
router.put('/update/:id', verifyToken, companyMembershipController.updateMembership);

/**
 * @swagger
 * /company-memberships/delete/{id}:
 *   delete:
 *     summary: Delete a membership
 *     tags: [CompanyMembership]
 */
router.delete('/delete/:id', verifyToken, companyMembershipController.deleteMembership);

module.exports = router;
