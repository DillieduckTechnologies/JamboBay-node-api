const Company = require('../models/company')
const { successResponse, errorResponse } = require('../helpers/responseHelper');

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
    if(req.user.role.name !== 'company'){
        return res.status(403).json({ message: 'Only users with company role can create a company.' });
    }
    const company = await Company.create(data);
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating company', error });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll()
    res.json(companies)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error })
  }
}

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
    if (!company) return res.status(404).json({ message: 'Company not found' })
    res.json(company)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error })
  }
}

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params
    const logo = req.file ? `uploads/companies/logos/${req.file.filename}` : undefined
    const data = { ...req.body }

    if (logo) data.logo = logo

    const company = await Company.update(id, data)
    res.json(company)
  } catch (error) {
    res.status(500).json({ message: 'Error updating company', error })
  }
}

exports.deleteCompany = async (req, res) => {
  try {
    if(req.user.role.name !== 'admin'){
        return res.status(403).json({ message: 'Only admin users can delete a company.' });
    }
    await Company.delete(req.params.id)
    res.json({ message: 'Company deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting company', error })
  }
}
