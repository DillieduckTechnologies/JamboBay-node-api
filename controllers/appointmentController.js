const Appointment = require('../models/appointment');
const User = require('../models/user');
const Client = require('../models/clientProfile');
const Agent = require('../models/agent');
const { sendAppointmentConfirmationEmail } = require('../helpers/mailHelper');
const ResidentialProperty = require('../models/residentialProperty');
const CommercialProperty = require('../models/commercialProperty');



// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data.client_id || !data.agent_id || !data.property_id || !data.appointment_date || !data.appointment_time || !data.property_type) {
      return res.status(400).json({ message: 'Missing required fields.' });
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
    await sendAppointmentConfirmationEmail(
      agent.email,
      `${client.first_name} ${client.last_name}`,
      `${agent.first_name} ${agent.last_name}`,
      property_name,
      data.appointment_date,
      formattedTime,
      action='Added',
      newAppointment.id
    );
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointments by agent
exports.getAppointmentsByAgent = async (req, res) => {
  try {
    const { agent_id } = req.params;
    const appointments = await Appointment.findByAgent(agent_id);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching agent appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointments by client
exports.getAppointmentsByClient = async (req, res) => {
  try {
    const { client_id } = req.params;
    const appointments = await Appointment.findByClient(client_id);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching client appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const updated = await Appointment.update(id, updates);
    res.json(updated);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.delete(id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
