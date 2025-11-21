const db = require('../db/connection');
const Agent = require('../models/agent');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const agentReferenceController = {
  async createReference(req, res) {
    try {
      const { agent_id, name, contact, relationship } = req.body;

      if (req.user.role !== 'agent') {
        return res.json(errorResponse("Unauthorized!", "Only users with agent role can create an agent reference.", 403))
      } else if (agent_id != await Agent.findAgentIdByUserId(req.user.id)) {
        return res.json(errorResponse("Unauthorized!", "You can only add your onw reference.", 403))
      }

      // Return the full record instead of just ID
      const [reference] = await db('agent_references')
        .insert({ agent_id, name, contact, relationship })
        .returning('*');


      return res.json(successResponse("Agent reference created successfully", reference, 201))
    } catch (error) {
      return res.json(errorResponse("An error occurred", err.message, 400));
    }
  }, 
  
  async getReferenceById(req, res) {
    try {
      const reference = await db('agent_references').where({ id: req.params.id }).first();
      if (!reference) return res.json(errorResponse("Not found!", "Reference not found.", 403))
      return res.json(successResponse("Agent reference fetched successfully", reference, 201))
    } catch (error) {
      return res.json(errorResponse("An error occurred", err.message, 400));
    }
  },

  async getReferencesByAgent(req, res) {
    try {
      const references = await db('agent_references')
        .where({ agent_id: req.params.agent_id })
        .orderBy('created_at', 'desc');
      return res.json(successResponse("Agent references fetched successfully", references, 201))
    } catch (error) {
      return res.json(errorResponse("An error occurred", err.message, 400));
    }
  },

  async updateReference(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      await db('agent_references').where({ id }).update(data);
      const updated = await db('agent_references').where({ id }).first();
      return res.json(successResponse("Agent reference updated successfully", updated, 201))
    } catch (error) {
      return res.json(errorResponse("An error occurred", err.message, 400));
    }
  },

  async deleteReference(req, res) {
    try {
      const deleted = await db('agent_references').where({ id: req.params.id }).del();
      if (!deleted) return res.json(errorResponse("Not found", "Agent reference not found", 404))
       return res.json(successResponse("Agent reference deleted successfully", null, 201))
    } catch (error) {
      return res.json(errorResponse("An error occurred", err.message, 400));
    }
  },
};

module.exports = agentReferenceController;
