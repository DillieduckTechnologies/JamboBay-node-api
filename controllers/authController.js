const User = require('../models/user');
const UserType = require('../models/userType');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const crypto = require('crypto');
const {sendPasswordResetEmail, sendVerificationEmail} = require("../helpers/mailHelper");

const {
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,loginSchema
} = require("../validators/authValidators");

// Login user
exports.login = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });

    // ✅ Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        error: 'Your email address is not verified. Please check your inbox for a verification link.',
      });
    }

    const role = await UserType.findById(user.user_type_id);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '3h' }
    );

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    // ✅ Update last_login timestamp
    await User.update(user.id, { last_login: new Date() });

    res.json({
      message: 'Login successful',
      token,
      expires_at: expiresAt,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role?.name || 'client',
        last_login: new Date(), // send updated timestamp back in response
      },
    });
  } catch (err) {
    logger.error('Login error: ' + err);
    next(err);
  }
};



// Verify Email
exports.verifyEmail = async (req, res, next) => {
  try {
    await verifyEmailSchema.validate(req.query);
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Verification token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.is_verified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    await User.update(user.id, { is_verified: true });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    logger.error("Email verification error: " + err);
    next(err);
  }
};

//Resend verification email
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.is_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Create a new token (valid for 24h)
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send a new email
    await sendVerificationEmail(user.email, token);

    res.status(200).json({ message: 'Verification email resent successfully' });
  } catch (err) {
    logger.error('Resend verification error: ' + err);
    next(err);
  }
};


// Forgot Password (send reset link)
exports.forgotPassword = async (req, res, next) => {
  try {
    await forgotPasswordSchema.validate(req.body);
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await User.update(user.id, {
      password_reset_token: hashedToken,
      password_reset_expires: resetExpires,
    });
   
    sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    logger.error("Forgot password error: " + err);
    next(err);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    await resetPasswordSchema.validate(req.body);
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Token and password are required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findByResetToken(hashedToken);

    if (!user || user.password_reset_expires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(user.id, {
      password: hashedPassword,
      password_reset_token: null,
      password_reset_expires: null,
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    logger.error("Reset password error: " + err);
    next(err);
  }
};