const User = require('../models/user');
const UserType = require('../models/userType');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendVerificationEmail } = require("../helpers/mailHelper");
const { successResponse, errorResponse } = require('../helpers/responseHelper');


const {
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema, loginSchema
} = require("../validators/authValidators");
const { error } = require('console');

// Login user
exports.login = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) return res.json(errorResponse("Incorrect login credentials", "User does not exist",401));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json(errorResponse("Incorrect Password","Incorrect Password!",401));

    // Check if email is verified
    if (!user.is_verified) {
      return res.json(errorResponse("Email not verified","Your email address is not verified. Please check your inbox for a verification link!",403));
      
    }

    const role = await UserType.findById(user.user_type_id);

    const token = jwt.sign(
      {
        id: user.id, username: user.username, role: role, first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: role.id,
        role: role?.name || 'client'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '3h' }
    );

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    // ✅ Update last_login timestamp
    await User.update(user.id, { last_login: new Date() });

    const response = {
      token,
      expires_at: expiresAt,
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: role.id,
        role: role?.name || 'client',
        last_login: new Date(),
      },
    };

    return res.json(successResponse("Login successfull", response, 201));
  } catch (err) {
    logger.error('Login error: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
   
  }
};



// Verify Email
exports.verifyEmail = async (req, res, next) => {
  try {
    await verifyEmailSchema.validate(req.query);
    const { token } = req.query;
    if (!token)  return res.json(errorResponse("Token is required", "Verification token missing", 400));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.json(errorResponse("User not found", "Enter correct email", 404));

    if (user.is_verified) {
      return res.json(successResponse("Email already verified", null, 200));
    }

    await User.update(user.id, { is_verified: true });

    return res.json(successResponse("Email verified successfully", null,200));
  } catch (err) {
    logger.error("Email verification error: " + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
   
  }
};

//Resend verification email
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user)  return res.json(errorResponse("User not found", "User not found", 404))

    if (user.is_verified) {
      return  res.json(errorResponse("Email already verified", "Email already verified", 400))
    }
    // Create a new token (valid for 24h)
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send a new email
    await sendVerificationEmail(user.email, user.first_name, token);

    return  res.json(successResponse("Verification email resent successfully", null, 200))
  } catch (err) {
    logger.error('Resend verification error: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};


// Forgot Password (send reset link)
exports.forgotPassword = async (req, res, next) => {
  try {
    await forgotPasswordSchema.validate(req.body);
    const { email } = req.body;
    if (!email) return res.json(errorResponse("Email is required", "Email is required", 400))

    const user = await User.findByEmail(email);
    if (!user)  return res.json(errorResponse("User not found", "User not found", 404))

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await User.update(user.id, {
      password_reset_token: hashedToken,
      password_reset_expires: resetExpires,
    });

    sendPasswordResetEmail(user.email, resetToken);

    return  res.json(successResponse("Password reset email sent", null, 200))
  } catch (err) {
    logger.error("Forgot password error: " + err);
    return res.json(errorResponse("Forgot password error", err.message, 400))
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    await resetPasswordSchema.validate(req.body);
    const { token, password } = req.body;
    if (!token || !password) return res.json(errorResponse("Missing fields", "Token and password are required", 400));

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findByResetToken(hashedToken);

    if (!user || user.password_reset_expires < Date.now()) {
      return res.json(errorResponse("Invalid or expired token", "Invalid or expired token", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(user.id, {
      password: hashedPassword,
      password_reset_token: null,
      password_reset_expires: null,
    });

    return  res.json(successResponse("Password reset successful", null, 200))
  } catch (err) {
    logger.error("Reset password error: " + err);
    return res.json(errorResponse("Reset password error", err.message, 400))
  }
};