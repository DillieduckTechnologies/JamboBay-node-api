const express = require('express');
const router = express.Router();
const leaseController = require('../controllers/leaseController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Leases
 *   description: Lease management for residential and commercial properties
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LeaseApplication:
 *       type: object
 *       required:
 *         - client_profile_id
 *         - lease_start_date
 *         - lease_end_date
 *         - monthly_rent
 *       properties:
 *         residential_property_id:
 *           type: integer
 *           nullable: true
 *           description: ID of the residential property (if applicable)
 *         commercial_property_id:
 *           type: integer
 *           nullable: true
 *           description: ID of the commercial property (if applicable)
 *         client_profile_id:
 *           type: integer
 *           description: Client applying for the lease
 *         lease_start_date:
 *           type: string
 *           format: date
 *           description: Start date of the lease
 *         lease_end_date:
 *           type: string
 *           format: date
 *           description: End date of the lease
 *         monthly_rent:
 *           type: number
 *           description: Monthly rent amount
 *         payment_frequency:
 *           type: string
 *           enum: [monthly, quarterly, yearly]
 *           default: monthly
 *           description: Frequency of rent payments
 *         special_requests:
 *           type: string
 *           nullable: true
 *           description: Any special requests for the lease
 *
 *     LeaseReview:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [approved, rejected]
 *           description: Lease approval status
 *
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
 */

/**
 * @swagger
 * /leases/apply:
 *   post:
 *     summary: Apply for a lease
 *     tags: [Leases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeaseApplication'
 *     responses:
 *       201:
 *         description: Lease application submitted successfully
 *       400:
 *         description: Invalid input
 */
router.post('/apply', verifyToken, leaseController.applyForLease);

/**
 * @swagger
 * /leases:
 *   get:
 *     summary: Get all leases
 *     tags: [Leases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter leases by status
 *       - in: query
 *         name: client_profile_id
 *         schema:
 *           type: integer
 *         description: Filter leases by client
 *     responses:
 *       200:
 *         description: List of leases
 */
router.get('/', verifyToken, leaseController.getAllLeases);

/**
 * @swagger
 * /leases/{id}:
 *   get:
 *     summary: Get lease by ID
 *     tags: [Leases]
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
 *         description: Lease details retrieved successfully
 *       404:
 *         description: Lease not found
 */
router.get('/:id', verifyToken, leaseController.getLeaseById);

/**
 * @swagger
 * /leases/{id}/review:
 *   patch:
 *     summary: Review lease (approve/reject)
 *     tags: [Leases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeaseReview'
 *     responses:
 *       200:
 *         description: Lease review updated
 *       400:
 *         description: Invalid request
 */
router.patch('/:id/review', verifyToken, leaseController.reviewLease);

module.exports = router;
