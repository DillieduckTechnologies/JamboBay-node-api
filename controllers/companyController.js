const Company = require('../models/company')
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const logger = require('../utils/logger');


exports.createCompany = async (req, res) => {
  try {
    const { name, registration_number, email, phone, address, website } = req.body;
    const logo = req.file ? `uploads/companies/logos/${req.file.filename}` : null;

    const createdBy = parseInt(req.user.id, 10);

    const data = {
      created_by: createdBy,
      name,
      registration_number,
      email,
      phone,
      address,
      website,
      logo,
    };
    if (req.user.role !== 'company') {
      return res.json(errorResponse("Unauthorized!", "Only users with company role can create a company.", 403));

    }
    const company = await Company.create(data);
    return res.json(successResponse("Company created successfully", company, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getCompanies = async (req, res) => {
  try {
    if (req.user.role !== 'admin' || req.user.role !== 'superuser') {
      return res.json(errorResponse("Unauthorized!", "Only users with admin or superuser roles can fetch companies.", 403));

    }
    const companies = await Company.findAll()
    return res.json(successResponse("Companies fetched successfully", companies, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
}

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
    if (!company) return res.json(errorResponse("Not found", "Company not found", 404));
    return res.json(successResponse("Company fetched successfully", company, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
}

exports.updateCompany = async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.json(errorResponse("Unauthorized!", "Only users with company role can update a company.", 403));

    }
    const { id } = req.params
    const logo = req.file ? `uploads/companies/logos/${req.file.filename}` : undefined
    const data = { ...req.body }

    if (logo) data.logo = logo

    const company = await Company.update(id, data)
    return res.json(successResponse("Company updated successfully", company, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
}

exports.deleteCompany = async (req, res) => {
  try {
    if (req.user.role.name !== 'admin') {
      return res.status(403).json({ message: 'Only admin users can delete a company.' });
    }
    await Company.delete(req.params.id)
    return res.json(successResponse("Company deleted successfully", null, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
}
