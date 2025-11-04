const db = require('../db/connection');

const Appointment = {
  // Create a new appointment
  async create(appointment) {
    const result = await db('appointments')
      .insert(appointment)
      .returning('*');
    return result[0];
  },

  // Find an appointment by ID
  async findById(id) {
    return db('appointments')
      .where({ id })
      .first();
  },

  // Retrieve all appointments (latest first)
  async findAll() {
    return db('appointments')
      .orderBy('appointment_date', 'desc');
  },

  // Retrieve appointments filtered by agent
  async findByAgent(agent_id) {
    return db('appointments')
      .where({ agent_id })
      .orderBy('appointment_date', 'desc');
  },

  // Retrieve appointments filtered by client
  async findByClient(client_id) {
    return db('appointments')
      .where({ client_id })
      .orderBy('appointment_date', 'desc');
  },

  // Update an appointment
  async update(id, data) {
    await db('appointments')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(), // keep updated_at fresh
      });
    return this.findById(id);
  },

  // Delete an appointment
  async delete(id) {
    return db('appointments')
      .where({ id })
      .del();
  }
};

module.exports = Appointment;
