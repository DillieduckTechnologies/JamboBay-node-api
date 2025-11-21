const Agent = require('../models/agent');
const { successResponse, errorResponse } = require('../helpers/responseHelper');


exports.createAgent = async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.json(errorResponse("Unauthorized!", "Only users with agent role can create an agent profile.", 403))
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
      return res.json(errorResponse("Missing fields", "Both ID document and EARB certificate are required.", 400))
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
    return res.json(successResponse("Agent created successfully", agent, 200));
  } catch (error) {
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getAgents = async (req, res) => {
  try {
    if (req.user?.role !== 'superuser') {
      return res.json(errorResponse("Unauthorized", "Access denied. Superuser privileges required.", 403))
    }
    const agents = await Agent.findAll();
    res.json(agents);
  } catch (error) {
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.json(errorResponse("Not found", "Agent not found.", 404))
    res.json(agent);
  } catch (error) {
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.getAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findAgentProfile(req.params.id);
    if (!agent) return res.json(errorResponse("Not found", "Agent not found.", 404))
    res.json(agent);
  } catch (error) {
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.update(req.params.id, req.body);
    res.json(agent);
  } catch (error) {
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    if (req.user.role.name !== 'admin') {
      return res.json(errorResponse("Unauthorized", "Only admin users can delete an agent.", 403))
    }
    await Agent.delete(req.params.id);
    return res.json(successResponse("Agent deleted successfully", null ,200 ))
  } catch (error) {
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
