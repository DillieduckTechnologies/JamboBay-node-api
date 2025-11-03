const PropertyLease = require('../models/propertyLease');

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

    // Basic validation
    if (!client_profile_id || (!residential_property_id && !commercial_property_id)) {
      return res.status(400).json({ message: 'Property and client_profile_id are required' });
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

    res.status(201).json({ message: 'Lease application submitted successfully', lease });
  } catch (error) {
    console.error('Error applying for lease:', error);
    res.status(500).json({ message: 'Error applying for lease', error });
  }
};

exports.getAllLeases = async (req, res) => {
  try {
    const leases = await PropertyLease.findAll(req.query);
    res.json(leases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leases', error });
  }
};

exports.getLeaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const lease = await PropertyLease.findById(id);

    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    res.json(lease);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lease', error });
  }
};

exports.reviewLease = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewerId = req.user?.id || req.body.reviewer_id;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await PropertyLease.reviewLease(id, reviewerId, status);
    res.json({ message: `Lease ${status} successfully`, lease: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing lease', error });
  }
};
