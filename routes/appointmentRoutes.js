const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management between clients and agents
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - client_id
 *         - agent_id
 *         - property_id
 *         - property_type
 *         - appointment_date
 *         - appointment_time
 *       properties:
 *         id:
 *           type: integer
 *         client_id:
 *           type: integer
 *           description: ID of the client (from client_profiles)
 *         agent_id:
 *           type: integer
 *           description: ID of the agent (from agents table)
 *         property_id:
 *           type: integer
 *           description: ID of the property (from residential or commercial table)
 *         property_type:
 *           type: string
 *           enum: [residential, commercial]
 *           description: Type of the property
 *         appointment_date:
 *           type: string
 *           format: date
 *           description: Date of the appointment
 *         appointment_time:
 *           type: string
 *           format: time
 *           description: Time of the appointment
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, completed, cancelled]
 *           default: pending
 *           description: Current status of the appointment
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Additional remarks or instructions
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /appointments/create:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Missing or invalid fields
 */
router.post('/', verifyToken, appointmentController.createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all appointments
 */
router.get('/', verifyToken, appointmentController.getAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
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
 *         description: Appointment retrieved successfully
 *       404:
 *         description: Appointment not found
 */
router.get('/:id', verifyToken, appointmentController.getAppointmentById);

/**
 * @swagger
 * /appointments/agent/{agent_id}:
 *   get:
 *     summary: Get appointments by agent ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agent_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of appointments for the agent
 */
router.get('/agent/:agent_id', verifyToken, appointmentController.getAppointmentsByAgent);

/**
 * @swagger
 * /appointments/client/{client_id}:
 *   get:
 *     summary: Get appointments by client ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of appointments for the client
 */
router.get('/client/:client_id', verifyToken, appointmentController.getAppointmentsByClient);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
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
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       404:
 *         description: Appointment not found
 */
router.put('/:id', verifyToken, appointmentController.updateAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
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
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 */
router.delete('/:id', verifyToken, appointmentController.deleteAppointment);

module.exports = router;
