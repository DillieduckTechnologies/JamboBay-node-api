const Appointment = require('../models/appointment');
const User = require('../models/user');
const Client = require('../models/clientProfile');
const Agent = require('../models/agent');
const { sendAppointmentConfirmationEmail } = require('../helpers/mailHelper');
const ResidentialProperty = require('../models/residentialProperty');
const CommercialProperty = require('../models/commercialProperty');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const logger = require('../utils/logger');


// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data.client_id || !data.agent_id || !data.property_id || !data.appointment_date || !data.appointment_time || !data.property_type) {
      return res.json(errorResponse("Missing fields", "Missing required fields.", 400));
    }

    const newAppointment = await Appointment.create(data);
    const client = await User.findById(await Client.findUserIdByProfileId(data.client_id));
    const agent = await User.findById(await Agent.findUserIdByProfileId(data.agent_id));
    let property_name = null;
    if (data.property_type === 'residential') {
      const property = await ResidentialProperty.findById(data.property_id);
      property_name = property ? property.name : 'the property';
    } else if (data.property_type === 'commercial') {
      const property = await CommercialProperty.findById(data.property_id);
      property_name = property ? property.name : 'the property';
    }

    const formattedTime = new Date(`2000-01-01T${data.appointment_time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    sendAppointmentConfirmationEmail(
      agent.email,
      `${client.first_name} ${client.last_name}`,
      `${agent.first_name} ${agent.last_name}`,
      property_name,
      data.appointment_date,
      formattedTime,
      action = 'Added',
      newAppointment.id
    );
    return res.json(successResponse("Appointment created successfully", newAppointment, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err.message);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    return res.json(successResponse("Appointments fetched successfully", appointments, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err.message);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Get a single appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.json(errorResponse("Not found", "Appointment not found", 404))
    }

    return res.json(successResponse("Appointment fetched successfully", appointment, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err.message);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Get appointments by agent
exports.getAppointmentsByAgent = async (req, res) => {
  try {
    const { agent_id } = req.params;
    const appointments = await Appointment.findByAgent(agent_id);
    return res.json(successResponse("Agent Appointments fetched successfully", appointments, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err.message);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Get appointments by client
exports.getAppointmentsByClient = async (req, res) => {
  try {
    const { client_id } = req.params;
    const appointments = await Appointment.findByClient(client_id);
    return res.json(successResponse("Client Appointments fetched successfully", appointments, 200))
  } catch (err) {
    logger.error('An error occurred: ' + err.message);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.json(errorResponse("Not found", "Appointment not found", 404))
    }

    const updated = await Appointment.update(id, updates);
    return res.json(successResponse("Appointment updated successfully", updated, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err.message);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.json(errorResponse("Not found", "Appointment not found", 404))
    }

    await Appointment.delete(id);
    return res.json(successResponse("Appointment deleted successfully", updated, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err.message);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
