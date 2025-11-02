const db = require('../db/connection');

const agentReferenceController = {
  async createReference(req, res) {
    try {
      const { agent_id, name, contact, relationship } = req.body;

      // Return the full record instead of just ID
      const [reference] = await db('agent_references')
        .insert({ agent_id, name, contact, relationship })
        .returning('*');

      res.status(201).json({ 
        message: 'Agent reference created successfully', 
        data: reference 
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to create agent reference' });
    }
  },

  async getReferenceById(req, res) {
    try {
      const reference = await db('agent_references').where({ id: req.params.id }).first();
      if (!reference) return res.status(404).json({ error: 'Reference not found' });
      res.json(reference);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching reference' });
    }
  },

  async getReferencesByAgent(req, res) {
    try {
      const references = await db('agent_references')
        .where({ agent_id: req.params.agent_id })
        .orderBy('created_at', 'desc');
      res.json(references);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching references' });
    }
  },

  async updateReference(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      await db('agent_references').where({ id }).update(data);
      const updated = await db('agent_references').where({ id }).first();
      res.json({ message: 'Agent reference updated successfully', data: updated });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteReference(req, res) {
    try {
      const deleted = await db('agent_references').where({ id: req.params.id }).del();
      if (!deleted) return res.status(404).json({ error: 'Reference not found' });
      res.json({ message: 'Agent reference deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete agent reference' });
    }
  },
};

module.exports = agentReferenceController;
