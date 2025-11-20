const ClientProfile = require('../models/clientProfile');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// Register or update client profile
exports.registerOrUpdateClient = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const {
      id_or_passport_number,
      phone_number,
      date_of_birth,
      gender,
      physical_address,
      city,
      county,
    } = req.body;

    const profile_photo = req.file ? req.file.path : null;

    // Check if profile exists
    const existingProfile = await ClientProfile.findByUserId(userId);

    if (existingProfile) {
      const updated = await ClientProfile.update(userId, {
        id_or_passport_number,
        phone_number,
        date_of_birth,
        gender,
        physical_address,
        city,
        county,
        profile_photo,
      });
      logger.info(`Client profile updated for user_id: ${userId}`);
      return res.json({ message: 'Profile updated successfully', profile: updated });
    } else {
      const newProfile = await ClientProfile.create({
        user_id: userId,
        id_or_passport_number,
        phone_number,
        date_of_birth,
        gender,
        physical_address,
        city,
        county,
        profile_photo,
      });
      logger.info(`Client profile created for user_id: ${userId}`);
      return res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
    }
  } catch (err) {
    logger.error('Client profile error: ' + err);
    next(err);
  }
};

// Get logged-in client's profile
exports.getClientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await ClientProfile.findByUserId(userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    logger.error('Fetch client profile error: ' + err);
    next(err);
  }
};
