const PurchaseApplication = require('../models/purchaseApplication');


exports.create = async (req, res) => {
  try {
    const data = req.body;
    const newApp = await PurchaseApplication.create(data);
    res.status(201).json({ message: 'Purchase application submitted successfully', data: newApp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating purchase application', error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { status, property_type } = req.query;
    const filters = { status, property_type };
    const apps = await PurchaseApplication.findAll(filters);
    res.status(200).json({ data: apps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching purchase applications', error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await PurchaseApplication.findById(id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ data: app });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching application', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PurchaseApplication.update(id, req.body);
    res.status(200).json({ message: 'Purchase application updated', data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
};

exports.getByClient = async (req, res) => {
  try {
    const { client_id } = req.params;
    const apps = await PurchaseApplication.findAll({ client_id });
    res.status(200).json({ data: apps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching client applications', error: error.message });
  }
};

exports.getByProperty = async (req, res) => {
  try {
    const { property_id } = req.params;
    const apps = await PurchaseApplication.findAll({ property_id });
    res.status(200).json({ data: apps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching property applications', error: error.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await knex('purchase_applications').where({ id }).del();

    if (!deleted) return res.status(404).json({ message: 'Purchase not found' });

    res.json({ message: 'Purchase application deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete purchase application' });
  }
};