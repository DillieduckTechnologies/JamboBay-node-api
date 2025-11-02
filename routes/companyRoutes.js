const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: API endpoints for managing companies
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Techify Limited"
 *         registration_number:
 *           type: string
 *           example: "C123456"
 *         email:
 *           type: string
 *           example: "info@techify.com"
 *         phone:
 *           type: string
 *           example: "+254700123456"
 *         address:
 *           type: string
 *           example: "Mombasa Road, Nairobi"
 *         logo:
 *           type: string
 *           example: "uploads/companies/logos/logo.png"
 *         website:
 *           type: string
 *           example: "https://techify.com"
 *         verified:
 *           type: boolean
 *           example: false
 *         verified_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-30T12:34:56Z"
 *         created_by:
 *           type: integer
 *           example: 3
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-29T10:00:00Z"
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
router.get('/', verifyToken, companyController.getCompanies);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get a single company by ID
 *     tags: [Companies]
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
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
router.get('/:id', verifyToken, companyController.getCompanyById);

/**
 * @swagger
 * /companies/create:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - registration_number
 *             properties:
 *               name:
 *                 type: string
 *               registration_number:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               website:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Invalid data or missing fields
 */
router.post('/create', verifyToken, upload.single('logo'), companyController.createCompany);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
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
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 */

//update -company

/**
 * @swagger
 * /companies/update/{id}:
 *   put:
 *     summary: Update a company
 *     description: Update details of an existing company. The company can also upload or change its logo.
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the company to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Techify Limited"
 *               registration_number:
 *                 type: string
 *                 example: "C123456"
 *               email:
 *                 type: string
 *                 example: "info@techify.com"
 *               phone:
 *                 type: string
 *                 example: "+254700123456"
 *               address:
 *                 type: string
 *                 example: "Mombasa Road, Nairobi"
 *               website:
 *                 type: string
 *                 example: "https://techify.com"
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', verifyToken, upload.single('logo'), companyController.updateCompany);

router.delete('/:id', verifyToken, companyController.deleteCompany);

module.exports = router;
