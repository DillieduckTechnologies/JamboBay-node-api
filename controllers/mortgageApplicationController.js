const MortgageApplication = require('../models/mortgageApplication');


exports.createApplication = async (req, res) => {
  try {
    const data = req.body;
    const app = await MortgageApplication.create(data);
    res.status(201).json({ message: 'Mortgage application submitted successfully', data: app });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating mortgage application', error: error.message });
  }
};


exports.getAllApplications = async (req, res) => {
  try {
    const filters = req.query;
    const apps = await MortgageApplication.findAll(filters);
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const app = await MortgageApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error: error.message });
  }
};

exports.getApplicationsByClient = async (req, res) => {
  try {
    const apps = await MortgageApplication.findByClient(req.params.client_id);
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client applications', error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const updated = await MortgageApplication.update(req.params.id, req.body);
    res.json({ message: 'Application updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    await MortgageApplication.delete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error: error.message });
  }
};
