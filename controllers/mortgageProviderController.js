const MortgageProvider = require('../models/mortgageProvider');
const { successResponse, errorResponse } = require('../helpers/responseHelper');


exports.createProvider = async (req, res) => {
  try {
    //admin creates
    console.log('User creating provider:', req.user);
    if (!req.user || req.user.role.name !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Only admins can create mortgage providers' });
    }

    const data = req.body;
    const provider = await MortgageProvider.create(data);
    res.status(201).json({ message: 'Mortgage provider created successfully', data: provider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating mortgage provider', error: error.message });
  }
};

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await MortgageProvider.findAll();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching providers', error: error.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await MortgageProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching provider', error: error.message });
  }
};

exports.updateProvider = async (req, res) => {
  try {
    //admin only 
    if (!req.user || req.user.role.name !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Only admins can update mortgage providers' });
    }
    
    const updated = await MortgageProvider.update(req.params.id, req.body);
    res.json({ message: 'Provider updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating provider', error: error.message });
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    await MortgageProvider.delete(req.params.id);
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting provider', error: error.message });
  }
};
