const User = require('../models/user');
const UserType = require('../models/userType');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const {sendVerificationEmail} = require("../helpers/mailHelper");




// Create user (registration)
exports.createUser = async (req, res, next) => {
  try {
    const { username, password, email, first_name, last_name, user_type_id } = req.body;

    if (!username || !password || !email || !first_name || !last_name || !user_type_id) {
      return res.status(400).json({
        error: 'All fields are required: username, password, email, first_name, last_name, user_type_id',
      });
    }

    const existing = await User.findByUsername(username);
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const roleId = user_type_id || (await UserType.findById(4))?.id || null;

    const newUser = await User.create({
      username,
      password,
      email,
      first_name,
      last_name,
      user_type_id: roleId,
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await sendVerificationEmail(email, first_name, token);


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

// Get all users (superuser only)
exports.getUsers = async (req, res, next) => {
  try {
    if (req.user?.role !== 'superuser') {
      return res.status(403).json({ error: 'Access denied. Superuser privileges required.' });
    }
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
