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
 * /leases/apply:
 *   post:
 *     summary: Apply for a lease
 *     tags: [Leases]
 *     parameters:
 *       - in: formData
 *         name: residential_property_id
 *         type: integer
 *       - in: formData
 *         name: commercial_property_id
 *         type: integer
 *       - in: formData
 *         name: client_profile_id
 *         type: integer
 *         required: true
 *       - in: formData
 *         name: lease_start_date
 *         type: string
 *         format: date
 *         required: true
 *       - in: formData
 *         name: lease_end_date
 *         type: string
 *         format: date
 *         required: true
 *       - in: formData
 *         name: monthly_rent
 *         type: number
 *         required: true
 *       - in: formData
 *         name: payment_frequency
 *         type: string
 *         default: monthly
 *       - in: formData
 *         name: special_requests
 *         type: string
 */
router.post('/apply', verifyToken, leaseController.applyForLease);

/**
 * @swagger
 * /leases:
 *   get:
 *     summary: Get all leases
 *     tags: [Leases]
 *     parameters:
 *       - in: query
 *         name: status
 *         type: string
 *       - in: query
 *         name: client_profile_id
 *         type: integer
 */
router.get('/', verifyToken, leaseController.getAllLeases);

/**
 * @swagger
 * /leases/{id}:
 *   get:
 *     summary: Get lease by ID
 *     tags: [Leases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 */
router.get('/:id', verifyToken, leaseController.getLeaseById);

/**
 * @swagger
 * /leases/{id}/review:
 *   patch:
 *     summary: Review lease (approve/reject)
 *     tags: [Leases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *       - in: formData
 *         name: status
 *         required: true
 *         type: string
 *         enum: [approved, rejected]
 */
router.patch('/:id/review', verifyToken, leaseController.reviewLease);

module.exports = router;
