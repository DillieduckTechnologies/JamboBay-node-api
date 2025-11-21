const PropertyLease = require('../models/propertyLease');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.applyForLease = async (req, res) => {
  try {
    const {
      residential_property_id,
      commercial_property_id,
      client_profile_id,
      lease_start_date,
      lease_end_date,
      monthly_rent,
      payment_frequency,
      special_requests,
    } = req.body;

    if (!client_profile_id || (!residential_property_id && !commercial_property_id)) {
      return res.json(errorResponse("Missing fields!", "Property and client_profile_id are required", 400));
    }

    const lease = await PropertyLease.create({
      residential_property_id,
      commercial_property_id,
      client_profile_id,
      lease_start_date,
      lease_end_date,
      monthly_rent,
      payment_frequency,
      special_requests,
    });

    return res.json(successResponse("Lease application submitted successfully", lease, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getAllLeases = async (req, res) => {
  try {
    const leases = await PropertyLease.findAll(req.query);
    return res.json(successResponse("Leases fetched successfully", leases, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getLeaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const lease = await PropertyLease.findById(id);

    if (!lease) return res.json(errorResponse("Not found", "Lease not found", 404));
    return res.json(successResponse("Lease fetched successfully", lease, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.reviewLease = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewerId = req.user?.id || req.body.reviewer_id;
    const { status } = req.body;

    //Agent can only approve or reject
    if (req.user.role.name !== 'agent') {
      return res.json(errorResponse("Unauthorized!", "Only agents can review lease.", 403));
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.json(errorResponse("Invalid!", "Invalid status value.", 400))
    }

    const updated = await PropertyLease.reviewLease(id, reviewerId, status);
    return res.json(successResponse(`Lease ${status} successfully`, lease, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
