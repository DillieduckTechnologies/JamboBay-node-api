const db = require('../db/connection');
const PropertyViewing = require('../models/propertyViewing');

const PropertyViewingController = {
  //Create a new property viewing
  async createViewing(req, res) {
    try {
      const { property_id, property_type, client_id, agent_id, scheduled_date } = req.body;

      if (!property_id || !property_type || !client_id || !agent_id || !scheduled_date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const viewing = await PropertyViewing.create({
        property_id,
        property_type,
        client_id,
        agent_id,
        scheduled_date
      });

      return res.status(201).json(viewing);
    } catch (error) {
      console.error('Error creating property viewing:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // Get all property viewings (optionally filtered)
  async getAllViewings(req, res) {
    try {
      const { status, property_type, agent_id, client_id } = req.query;
      let query = db('property_viewings').orderBy('created_at', 'desc');

      if (status) query = query.where('status', status);
      if (property_type) query = query.where('property_type', property_type);
      if (agent_id) query = query.where('agent_id', agent_id);
      if (client_id) query = query.where('client_id', client_id);

      const viewings = await query;

      // Attach property details dynamically
      const enrichedViewings = await Promise.all(
        viewings.map(async (view) => {
          const table =
            view.property_type === 'residential'
              ? 'residential_properties'
              : 'commercial_properties';

          const property = await db(table).where('id', view.property_id).first();
          return { ...view, property };
        })
      );

      return res.json(enrichedViewings);
    } catch (error) {
      console.error('Error fetching viewings:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  //Get viewing by ID (with property details)
  async getViewingById(req, res) {
    try {
      const { id } = req.params;
      const viewing = await PropertyViewing.findById(id);

      if (!viewing) return res.status(404).json({ error: 'Viewing not found' });

      const table =
        viewing.property_type === 'residential'
          ? 'residential_properties'
          : 'commercial_properties';

      const property = await db(table).where('id', viewing.property_id).first();
      return res.json({ ...viewing, property });
    } catch (error) {
      console.error('Error fetching viewing:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  //Update viewing status or details
  async updateViewing(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await PropertyViewing.update(id, data);
      if (!updated) return res.status(404).json({ error: 'Viewing not found' });

      return res.json(updated);
    } catch (error) {
      console.error('Error updating viewing:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  //Delete a viewing
  async deleteViewing(req, res) {
    try {
      const { id } = req.params;
      const deleted = await PropertyViewing.delete(id);

      if (!deleted) return res.status(404).json({ error: 'Viewing not found' });
      return res.json({ message: 'Viewing deleted successfully' });
    } catch (error) {
      console.error('Error deleting viewing:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = PropertyViewingController;
