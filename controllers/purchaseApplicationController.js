const PurchaseApplication = require('../models/purchaseApplication');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const logger = require('../utils/logger');


exports.create = async (req, res) => {
  try {
    const data = req.body;
    const newApp = await PurchaseApplication.create(data);
    return res.json(successResponse("Purchase application submitted successfully", newApp, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getAll = async (req, res) => {
  try {
    const { status, property_type } = req.query;
    const filters = { status, property_type };
    const apps = await PurchaseApplication.findAll(filters);
    return res.json(successResponse("Purchase applications fetched successfully", apps, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await PurchaseApplication.findById(id);
    if (!app) return res.json(errorResponse("Not found", "Application not found", 404));
    return res.json(successResponse("Purchase application fetched successfully", newApp, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PurchaseApplication.update(id, req.body);
    return res.json(successResponse("Purchase application updated successfully", updated, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getByClient = async (req, res) => {
  try {
    const { client_id } = req.params;
    const apps = await PurchaseApplication.findAll({ client_id });
    return res.json(successResponse("Purchase applications by client fetched successfully", apps, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getByProperty = async (req, res) => {
  try {
    const { property_id } = req.params;
    const apps = await PurchaseApplication.findAll({ property_id });
    return res.json(successResponse("Purchase applications by property fetched successfully", apps, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await knex('purchase_applications').where({ id }).del();

    if (!deleted) return res.json(errorResponse("Not found", "Application not found", 404));

    res.json({ message: 'Purchase application deleted successfully' });
    return res.json(successResponse("Purchase application deleted successfully", deleted, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};