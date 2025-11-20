const Agent = require('../models/agent');
const { successResponse, errorResponse } = require('../helpers/responseHelper');


exports.createAgent = async (req, res) => {
  try {
    if(req.user.role.name !== 'agent'){
        return res.status(403).json({ message: 'Only users with agent role can create an agent profile.' });
    }
    const userId = req.user.id; 
    const {
      id_or_passport_number,
      physical_address,
      office_address,
      earb_certificate_serial_number,
      earb_issued_date,
      verification_notes
    } = req.body;

    const id_document = req.files?.id_document?.[0]?.path || null;
    const earb_certificate_file = req.files?.earb_certificate_file?.[0]?.path || null;

    if (!id_document || !earb_certificate_file) {
      return res.status(400).json({ message: 'Both ID document and EARB certificate are required.' });
    }

    const agent = await Agent.create({
      user_id: userId,
      id_or_passport_number,
      id_document,
      physical_address,
      office_address,
      earb_certificate_serial_number,
      earb_issued_date,
      earb_certificate_file,
      verification_notes
    });

    res.status(201).json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating agent', error });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents', error });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agent', error });
  }
};

exports.getAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findAgentProfile(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent profile not found' });
    res.json(agent);  
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agent profile', error });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.update(req.params.id, req.body);
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating agent', error });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    if(req.user.role.name !== 'admin'){
        return res.status(403).json({ message: 'Only admin users can delete an agent.' });
    }
    await Agent.delete(req.params.id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting agent', error });
  }
};
