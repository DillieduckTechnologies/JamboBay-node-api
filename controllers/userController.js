const User = require('../models/user');
const UserType = require('../models/userType');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const {sendVerificationEmail} = require("../helpers/mailHelper");
const bcrypt = require('bcrypt');


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

//update user

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, first_name, last_name, user_type_id, password } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find existing user
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedData = {};
    let emailChanged = false;

    // ✅ Username update + check
    if (username && username !== existingUser.username) {
      const usernameExists = await User.findByUsername(username);
      if (usernameExists && usernameExists.id !== parseInt(id)) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updatedData.username = username;
    }

    // ✅ Email update + verification reset
    if (email && email !== existingUser.email) {
      const emailExists = await User.findByEmail(email);
      if (emailExists && emailExists.id !== parseInt(id)) {
        return res.status(400).json({ error: 'Email already taken' });
      }

      emailChanged = true;
      updatedData.email = email;
      updatedData.is_verified = false;
    }

    // ✅ Other optional fields
    if (first_name) updatedData.first_name = first_name;
    if (last_name) updatedData.last_name = last_name;
    if (user_type_id) updatedData.user_type_id = user_type_id;

    // ✅ Password update (if provided)
    if (password) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(password, saltRounds);
    }

    // Reject if nothing to update
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Update user
    await User.update(id, updatedData);
    const updatedUser = await User.findById(id);

    // ✅ If email changed, send verification email
    if (emailChanged) {
      const token = jwt.sign({ id: updatedUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      await sendVerificationEmail(updatedUser.email, updatedUser.first_name, token);
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        user_type_id: updatedUser.user_type_id,
        is_verified: updatedUser.is_verified,
        date_joined: updatedUser.date_joined,
      },
    });
  } catch (err) {
    logger.error('Error updating user: ' + err);
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
