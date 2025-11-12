const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Manage client profiles
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         middle_name:
 *           type: string
 *         id_or_passport_number:
 *           type: string
 *         phone_number:
 *           type: string
 *         date_of_birth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         profile_photo:
 *           type: string
 *         physical_address:
 *           type: string
 *         city:
 *           type: string
 *         county:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /clients/update:
 *   post:
 *     summary: Create or update client profile
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id_or_passport_number:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               physical_address:
 *                 type: string
 *               city:
 *                 type: string
 *               county:
 *                 type: string
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientProfile'
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientProfile'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /clients/me:
 *   get:
 *     summary: Get logged-in client's profile
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */

// Register or update client profile (authenticated users only)
router.post(
  '/update',
  verifyToken,
  upload.single('profile_photo'),
  clientController.registerOrUpdateClient
);

// Get logged-in client's profile
router.get('/me', verifyToken, clientController.getClientProfile);

module.exports = router;
