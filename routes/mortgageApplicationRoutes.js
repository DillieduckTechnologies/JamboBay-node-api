const express = require('express');
const router = express.Router();
const appController = require('../controllers/mortgageApplicationController');
const { verifyToken } = require('../middleware/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Mortgage Applications
 *   description: Manage mortgage applications
 */

/**
 * @swagger
 * /mortgage/applications/create:
 *   post:
 *     summary: Create a new mortgage application
 *     tags: [Mortgage Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: integer
 *               property_id:
 *                 type: integer
 *               property_type:
 *                 type: string
 *                 enum: [residential, commercial]
 *               provider_id:
 *                 type: integer
 *               amount_requested:
 *                 type: number
 *               repayment_period_years:
 *                 type: integer
 *               monthly_income:
 *                 type: number
 *               notes:
 *                 type: string
 */
router.post('/create', verifyToken, appController.createApplication);

/**
 * @swagger
 * /mortgage/applications:
 *   get:
 *     summary: Get all mortgage applications
 *     tags: [Mortgage Applications]
 */
router.get('/', verifyToken, appController.getAllApplications);

/**
 * @swagger
 * /mortgage/applications/{id}:
 *   get:
 *     summary: Get mortgage application by ID
 *     tags: [Mortgage Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', verifyToken, appController.getApplicationById);

/**
 * @swagger
 * /mortgage/applications/client/{client_id}:
 *   get:
 *     summary: Get mortgage applications by client ID
 *     tags: [Mortgage Applications]
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/client/:client_id', verifyToken, appController.getApplicationsByClient);

/**
 * @swagger
 * /mortgage/applications/update/{id}:
 *   put:
 *     summary: Update mortgage application
 *     tags: [Mortgage Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put('/update/:id', verifyToken, appController.updateApplication);

/**
 * @swagger
 * /mortgage/applications/delete/{id}:
 *   delete:
 *     summary: Delete mortgage application
 *     tags: [Mortgage Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/delete/:id', verifyToken, appController.deleteApplication);

module.exports = router;
