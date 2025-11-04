const express = require('express');
const router = express.Router();
const commercialPropertyController = require('../controllers/commercialPropertyController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Commercial Property
 *   description: Manage commercial properties
 */


/**
 * @swagger
 * /commercial-properties:
 *   get:
 *     summary: Get all commercial properties
 *     tags: [Commercial Property]
 *     responses:
 *       200:
 *         description: List of all properties
 */
router.get('/', commercialPropertyController.getProperties);

/**
 * @swagger
 * /commercial-properties/{id}:
 *   get:
 *     summary: Get single property by ID
 *     tags: [Commercial Property]
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
router.get('/:id', commercialPropertyController.getPropertyById);


/**
 * @swagger
 * /commercial-properties/create:
 *   post:
 *     summary: Create a new commercial property with images
 *     tags: [Commercial Property]
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
 *               sub_county:
 *                 type: string
 *                 example: "Nyali"
 *               ward:
 *                  type: string
 *                  example: "Kongowea"
 *               postal_code:
 *                  type: string
 *                  example: "80100"  
 *               latitude:
 *                 type: number
 *                 example: -4.0435
 *               longitude:
 *                 type: number
 *                 example: 39.6682
 *               price:
 *                 type: number
 *                 example: 80000
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
  commercialPropertyController.createProperty
)

/**
 * @swagger
 * /commercial-properties/update/{id}:
 *   put:
 *     summary: Update an existing property and optionally upload images
 *     tags: [Commercial Property]
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
router.put('/update/:id', verifyToken, upload.array('images', 10), commercialPropertyController.updateProperty)

/**
 * @swagger
 * /commercial-properties/delete/{id}:
 *   delete:
 *     summary: Delete a commercial property
 *     tags: [Commercial Property]
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
router.delete('/delete/:id', verifyToken, commercialPropertyController.deleteProperty);

/**
 * @swagger
 * /commercial-properties/{id}/images:
 *   post:
 *     summary: Upload an image for a property
 *     tags: [Commercial Property]
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
  commercialPropertyController.uploadPropertyImage
);

module.exports = router;
