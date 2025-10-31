const User = require('../models/user');
const UserType = require('../models/userType');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Register user
exports.createUser = async (req, res, next) => {
  try {
    const { username, password, email, first_name, last_name, user_type_id } = req.body;

    if (!username || !password || !email || !first_name || !last_name || !user_type_id) {
      return res.status(400).json({
        error: 'All fields are required: username, password, email, first_name, last_name, user_type_id',
      });
    }

    // Check if username exists
    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Default to "client" role if not provided
    let roleId = user_type_id;
    if (!roleId) {
      const clientRole = await UserType.findById(4); 
      roleId = clientRole ? clientRole.id : null;
    }

    const newUser = await User.create({
      username,
      password,
      email,
      first_name,
      last_name,
      user_type_id: roleId,
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      user_type_id: newUser.user_type_id,
      date_joined: newUser.date_joined,
    });
  } catch (err) {
    logger.error('Error creating user: ' + err);
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });

    // Fetch role name for convenience
    const role = await UserType.findById(user.user_type_id);

    // Generate JWT (3 hours)
    const token = jwt.sign(
      { id: user.id, username: user.username, role: role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '3h' }
    );

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    res.json({
      message: 'Login successful',
      token,
      expires_at: expiresAt,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role?.name || 'client',
      },
    });
  } catch (err) {
    logger.error('Login error: ' + err);
    next(err);
  }
};

// Get all users (superuser only)
exports.getUsers = async (req, res, next) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== 'superuser') {
      return res.status(403).json({ error: 'Access denied. Superuser privileges required.' });
    }

    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
