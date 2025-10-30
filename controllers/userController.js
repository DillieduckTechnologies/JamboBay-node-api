const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');


// Register user
exports.createUser = async (req, res, next) => {
    try {
        const { username, password, email, first_name, last_name } = req.body;

        if (!username || !password || !email || !first_name || !last_name) {
            return res.status(400).json({
                error: 'All fields are required: username, password, email, first_name, last_name'
            });
        }

        const existing = await User.findByUsername(username);
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const newUser = await User.create({ username, password, email, first_name, last_name });
        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            date_joined: newUser.date_joined,
        });
    } catch (err) {
        next(err);
    }
};

// Login user
exports.login = async (req, res, next) => {
    try {
        console.log('Login request body:', req);
        const { username, password } = req.body;
        const user = await User.findByUsername(username);

        if (!user)
            return res.status(401).json({ error: 'Invalid username or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: 'Invalid username or password' });

        // Generate JWT token (expires in 3 hours)
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

        res.json({
            message: 'Login successful',
            token,
            expires_at: expiresAt,
            user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (err) {
        logger.error('Login error: ' + err);
        next(err);
    }
};

// Get all users (protected)
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        next(err);
    }
};
