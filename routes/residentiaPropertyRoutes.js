const express = require('express');
const router = express.Router();
const residentialPropertyController = require('../controllers/residentialPropertyController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Residential Property
 *   description: Manage residential properties
 */


/**
 * @swagger
 * /residential-properties:
 *   get:
 *     summary: Get all residential properties
 *     tags: [Residential Property]
 *     responses:
 *       200:
 *         description: List of all properties
 */
router.get('/', residentialPropertyController.getProperties);

/**
 * @swagger
 * /residential-properties/{id}:
 *   get:
 *     summary: Get single property by ID
 *     tags: [Residential Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The property ID
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get('/:id', residentialPropertyController.getPropertyById);


/**
 * @swagger
 * /residential-properties/create:
 *   post:
 *     summary: Create a new residential property with images
 *     tags: [Residential Property]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Luxury Apartment"
 *               category:
 *                 type: string
 *                 example: "apartment"
 *               listing_type:
 *                 type: string
 *                 example: "rent"
 *               description:
 *                 type: string
 *                 example: "Spacious 2-bedroom apartment with ocean view."
 *               physical_address:
 *                 type: string
 *                 example: "Nyali Beach Road, Mombasa"
 *               city:
 *                 type: string
 *                 example: "Mombasa"
 *               county:
 *                 type: string
 *                 example: "Mombasa County"
 *               gps_latitude:
 *                 type: number
 *                 example: -4.0435
 *               gps_longitude:
 *                 type: number
 *                 example: 39.6682
 *               price:
 *                 type: number
 *                 example: 80000
 *               bedrooms:
 *                 type: integer
 *                 example: 2
 *               bathrooms:
 *                 type: integer
 *                 example: 2
 *               size_sqft:
 *                 type: integer
 *                 example: 1200
 *               available_from:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-01"
 *               company_id:
 *                 type: integer
 *                 example: 1
 *               agent_id:
 *                 type: integer
 *                 example: 3
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  '/create',
  verifyToken,
  upload.array('images', 10),
  residentialPropertyController.createProperty
)

/**
 * @swagger
 * /residential-properties/update/{id}:
 *   put:
 *     summary: Update an existing property and optionally upload images
 *     tags: [Residential Property]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Property ID
 */
router.put('/update/:id', verifyToken, upload.array('images', 10), residentialPropertyController.updateProperty)

/**
 * @swagger
 * /residential-properties/delete/{id}:
 *   delete:
 *     summary: Delete a residential property
 *     tags: [Residential Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 */
router.delete('/delete/:id', verifyToken, residentialPropertyController.deleteProperty);

/**
 * @swagger
 * /residential-properties/{id}/images:
 *   post:
 *     summary: Upload an image for a property
 *     tags: [Residential Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID to attach the image to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               caption:
 *                 type: string
 *                 example: "Front view of the house"
 *               is_primary:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */
router.post(
  '/:id/images',
  verifyToken,
  upload.single('image'),
  residentialPropertyController.uploadPropertyImage
);

module.exports = router;
