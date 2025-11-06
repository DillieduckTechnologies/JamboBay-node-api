const express = require('express');
const router = express.Router();
const providerController = require('../controllers/mortgageProviderController');
const { verifyToken } = require('../middleware/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Mortgage Providers
 *   description: Manage mortgage providers (banks, SACCOs, etc.)
 */

/**
 * @swagger
 * /mortgage/providers/create:
 *   post:
 *     summary: Create a new mortgage provider
 *     tags: [Mortgage Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               website:
 *                 type: string
 *               address:
 *                 type: string
 *               verified:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Provider created successfully
 */
router.post('/create', verifyToken, providerController.createProvider);

/**
 * @swagger
 * /mortgage/providers:
 *   get:
 *     summary: Get all mortgage providers
 *     tags: [Mortgage Providers]
 */
router.get('/', verifyToken, providerController.getAllProviders);

/**
 * @swagger
 * /mortgage/providers/{id}:
 *   get:
 *     summary: Get mortgage provider by ID
 *     tags: [Mortgage Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', verifyToken, providerController.getProviderById);

/**
 * @swagger
 * /mortgage/providers/update/{id}:
 *   put:
 *     summary: Update mortgage provider
 *     tags: [Mortgage Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put('/update:id', verifyToken, providerController.updateProvider);

/**
 * @swagger
 * /mortgage/providers/delete/{id}:
 *   delete:
 *     summary: Delete mortgage provider
 *     tags: [Mortgage Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/delete:id', verifyToken, providerController.deleteProvider);

module.exports = router;
