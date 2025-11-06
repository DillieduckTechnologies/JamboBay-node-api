const express = require('express');
const router = express.Router();
const propertyViewingController = require('../controllers/propertyViewingController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Property Viewings
 *   description: Manage viewings for residential and commercial properties
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PropertyViewing:
 *       type: object
 *       required:
 *         - property_id
 *         - property_type
 *         - client_id
 *         - agent_id
 *         - scheduled_date
 *       properties:
 *         id:
 *           type: integer
 *         property_id:
 *           type: integer
 *           description: ID of the property
 *         property_type:
 *           type: string
 *           enum: [residential, commercial]
 *         client_id:
 *           type: integer
 *         agent_id:
 *           type: integer
 *         scheduled_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /property-viewings:
 *   post:
 *     summary: Create a new property viewing
 *     tags: [Property Viewings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyViewing'
 *     responses:
 *       201:
 *         description: Viewing created successfully
 */
router.post('/', verifyToken, propertyViewingController.createViewing);

/**
 * @swagger
 * /property-viewings:
 *   get:
 *     summary: Get all property viewings
 *     tags: [Property Viewings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: property_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: agent_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of property viewings
 */
router.get('/', verifyToken, propertyViewingController.getAllViewings);

/**
 * @swagger
 * /property-viewings/{id}:
 *   get:
 *     summary: Get property viewing by ID
 *     tags: [Property Viewings]
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
 *         description: Viewing details (with property info)
 *       404:
 *         description: Viewing not found
 */
router.get('/:id', verifyToken, propertyViewingController.getViewingById);

/**
 * @swagger
 * /property-viewings/update/{id}:
 *   patch:
 *     summary: Update a property viewing (e.g., status or scheduled date)
 *     tags: [Property Viewings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the property viewing to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: confirmed
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-05T14:30:00Z"
 *             example:
 *               status: confirmed
 *               scheduled_date: "2025-11-05T14:30:00Z"
 *     responses:
 *       200:
 *         description: Viewing updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Viewing not found
 */
router.patch('/update/:id', verifyToken, propertyViewingController.updateViewing);

/**
 * @swagger
 * /property-viewings/delete/{id}:
 *   delete:
 *     summary: Delete a property viewing
 *     tags: [Property Viewings]
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
 *         description: Viewing deleted successfully
 */
router.delete('/delete/:id', verifyToken, propertyViewingController.deleteViewing);

module.exports = router;
