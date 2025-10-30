const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.createUser);
router.post('/login', userController.login);

// Protected routes
router.get('/', verifyToken, userController.getUsers);

module.exports = router;
