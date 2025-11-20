const CompanyMembership = require('../models/companyMembership');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.getMemberships = async (req, res) => {
  try {
    const memberships = await CompanyMembership.findAll();
    res.json(memberships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching memberships', error });
  }
};

exports.getMembershipById = async (req, res) => {
  try {
    const membership = await CompanyMembership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    res.json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching membership', error });
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
    res.status(201).json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating membership', error });
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
    res.json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating membership', error });
  }
};

exports.deleteMembership = async (req, res) => {
  try {
    await CompanyMembership.delete(req.params.id);
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting membership', error });
  }
};
