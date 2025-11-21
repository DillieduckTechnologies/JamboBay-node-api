const MortgageApplication = require('../models/mortgageApplication');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const logger = require('../utils/logger');


exports.createApplication = async (req, res) => {
  try {
    const data = req.body;
    const app = await MortgageApplication.create(data);
    return res.json(successResponse("Mortgage application submitted successfully", app, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};


exports.getAllApplications = async (req, res) => {
  try {
    const filters = req.query;
    const apps = await MortgageApplication.findAll(filters);
    return res.json(successResponse("Mortgage applications fetched successfully", apps, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const app = await MortgageApplication.findById(req.params.id);
    if (!app) return res.json(errorResponse("Not found", "Application not found", 404));
    return res.json(successResponse("Mortgage applications fetched successfully", app, 200))

  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getApplicationsByClient = async (req, res) => {
  try {
    const apps = await MortgageApplication.findByClient(req.params.client_id);
    return res.json(successResponse("Mortgage applications by client fetched successfully", apps, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const updated = await MortgageApplication.update(req.params.id, req.body);
    return res.json(successResponse("Mortgage application updated successfully", updated, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    await MortgageApplication.delete(req.params.id);
    return res.json(successResponse("Mortgage application deleted successfully", null, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
