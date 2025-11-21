const MortgageProvider = require('../models/mortgageProvider');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const logger = require('../utils/logger');


exports.createProvider = async (req, res) => {
  try {
    //admin creates
    if (!req.user || req.user.role.name !== 'admin') {
      return res.json(errorResponse("Unauthorized!", "Only admins can create mortgage providers.", 403));
    }

    const data = req.body;
    const provider = await MortgageProvider.create(data);
    return res.json(successResponse("Mortgage provider created successfully", provider, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await MortgageProvider.findAll();
    return res.json(successResponse("Mortgage providers fetched successfully", providers, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await MortgageProvider.findById(req.params.id);
    if (!provider) return res.json(errorResponse("Not found", "Provider not found", 404));
    return res.json(successResponse("Mortgage provider fetched successfully", provider, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.updateProvider = async (req, res) => {
  try {
    //admin only 
    if (!req.user || req.user.role.name !== 'admin') {
      return res.json(errorResponse("Unauthorized!", "Only admins can update mortgage providers.", 403));
    }

    const updated = await MortgageProvider.update(req.params.id, req.body);
    return res.json(successResponse("Mortgage provider updated successfully", updated, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    await MortgageProvider.delete(req.params.id);
    return res.json(successResponse("Mortgage provider deleted successfully", req.params.id, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
