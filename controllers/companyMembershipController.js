const CompanyMembership = require('../models/companyMembership');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const logger = require('../utils/logger');


exports.getMemberships = async (req, res) => {
  try {
    const memberships = await CompanyMembership.findAll();
    return res.json(successResponse("Company Memberships fetched successfully", memberships, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getMembershipById = async (req, res) => {
  try {
    const membership = await CompanyMembership.findById(req.params.id);
    if (!membership) return res.json(errorResponse("Not found", "Membership not found", 404));
    return res.json(successResponse("Company Membership fetched successfully", membership, 200))

  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.createMembership = async (req, res) => {
  try {
    const { agent_id, company_id, status } = req.body;

    const data = {
      agent_id,
      company_id,
      status: status || 'pending',
    };

    const membership = await CompanyMembership.create(data);
    return res.json(successResponse("Company Membership created successfully", membership, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.updateMembership = async (req, res) => {
  try {
    const { status } = req.body;
    const data = {
      status,
      decided_at: new Date(),
      decided_by: req.user?.id || null,
    };

    const membership = await CompanyMembership.update(req.params.id, data);
    return res.json(successResponse("Company Membership updated successfully", membership, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.deleteMembership = async (req, res) => {
  try {
    await CompanyMembership.delete(req.params.id);
    return res.json(successResponse("Company Membership deleted successfully", null, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
