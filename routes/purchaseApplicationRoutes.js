const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseApplicationController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Purchase Applications
 *   description: Manage property purchase applications
 */

/**
 * @swagger
 * /purchase-applications:
 *   get:
 *     summary: Get all purchase applications (optionally filter by status or type)
 *     tags: [Purchase Applications]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *       - in: query
 *         name: property_type
 *         schema:
 *           type: string
 *           enum: [residential, commercial]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchase applications
 */
router.get('/', verifyToken, purchaseController.getAll);

/**
 * @swagger
 * /purchase-applications/{id}:
 *   get:
 *     summary: Get a single purchase application by ID
 *     tags: [Purchase Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase application details
 */
router.get('/:id', verifyToken, purchaseController.getOne);

/**
 * @swagger
 * /purchase-applications/client/{client_id}:
 *   get:
 *     summary: Get purchase applications by client
 *     tags: [Purchase Applications]
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client's purchase applications
 */
router.get('/client/:client_id', verifyToken, purchaseController.getByClient);

/**
 * @swagger
 * /purchase-applications/property/{property_id}:
 *   get:
 *     summary: Get purchase applications by property
 *     tags: [Purchase Applications]
 *     parameters:
 *       - in: path
 *         name: property_id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase applications for a specific property
 */
router.get('/property/:property_id', verifyToken, purchaseController.getByProperty);

/**
 * @swagger
 * /purchase-applications/create:
 *   post:
 *     summary: Submit a new purchase application
 *     tags: [Purchase Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - property_id
 *               - property_type
 *               - client_id
 *               - offer_price
 *             properties:
 *               property_id:
 *                 type: integer
 *                 example: 12
 *               property_type:
 *                 type: string
 *                 enum: [residential, commercial]
 *                 example: residential
 *               client_id:
 *                 type: integer
 *                 example: 101
 *               offer_price:
 *                 type: number
 *                 format: decimal
 *                 example: 4500000.00
 *               remarks:
 *                 type: string
 *                 example: "Client willing to pay in installments"
 *     responses:
 *       201:
 *         description: Purchase application created successfully
 */
router.post('/create', verifyToken, purchaseController.create);

/**
 * @swagger
 * /purchase-applications/update/{id}:
 *   patch:
 *     summary: Update a purchase application (approve/reject/edit remarks)
 *     tags: [Purchase Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: integer
 *                 example: 12
 *               property_type:
 *                 type: string
 *                 enum: [residential, commercial]
 *                 example: commercial
 *               client_id:
 *                 type: integer
 *                 example: 101
 *               offer_price:
 *                 type: number
 *                 example: 4800000.00
 *               remarks:
 *                 type: string
 *                 example: "Price reviewed after negotiation"
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 example: approved
 *               reviewed_by:
 *                 type: integer
 *                 example: 4
 *               reviewed_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-06T10:30:00Z"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application updated successfully
 */
router.patch('/update/:id', verifyToken, purchaseController.update);

/**
 * @swagger
 * /purchase-applications/delete/{id}:
 *   delete:
 *     summary: Delete a purchase application
 *     tags: [Purchase Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application deleted
 */
router.delete('/delete/:id', verifyToken, purchaseController.deletePurchase);

module.exports = router;
