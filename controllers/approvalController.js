const Agent = require('../models/agent');
const Company = require('../models/company');
const CommercialProperty = require('../models/commercialProperty');
const ResidentialProperty = require('../models/residentialProperty');
const logger = require('../utils/logger');
const { sendApprovalEmail, sendRejectionEmail } = require('../helpers/mailHelper');
const User = require('../models/user');
const { successResponse, errorResponse } = require('../helpers/responseHelper');


exports.updateApproval = async (req, res, next) => {
  try {
    //Only admins can perform this action
    if (!req.user || req.user.role.name !== 'admin') {
      return res.status(403).json({ error: 'Only admins can perform approvals or verifications' });
    }

    var { action, reason, notes, id, type } = req.body;

    // Map each type to its model
    const models = {
      agent: Agent,
      company: Company,
      commercial: CommercialProperty,
      residential: ResidentialProperty,
    };

    const model = models[type];
    if (!model) {
      return res.status(400).json({ error: 'Invalid approval type' });
    }

    const entity = await model.findById(id);
    if (!entity) {
      return res.status(404).json({ error: `${type} not found` });
    }

    const updateData = {};
    const now = new Date();

    // Agents & Companies use verified_* fields
    if (type === 'agent' || type === 'company') {
      if (action === 'approve') {
        updateData.status = 'approved';
        updateData.verified = true;
        updateData.verified_by = req.user.id;
        updateData.verified_at = now;
      } else if (action === 'reject') {
        updateData.status = 'rejected';
        updateData.verified = false;
        updateData.verified_by = req.user.id;
        updateData.verified_at = now;
      } else {
        return res.status(400).json({ error: 'Action must be approve or reject' });
      }

      // Apply verification notes for both agents & companies
      updateData.verification_notes = notes || null;
    }

    // Residential & Commercial Properties use approved_* fields
    else if (type === 'residential' || type === 'commercial') {
      if (action === 'approve') {
        updateData.status = 'approved';
        updateData.approved = true;
        updateData.approved_by = req.user.id;
        updateData.approved_at = now;
        updateData.rejection_reason = null;
      } else if (action === 'reject') {
        updateData.status = 'rejected';
        updateData.approved = false;
        updateData.approved_by = req.user.id;
        updateData.approved_at = now;
        updateData.rejection_reason = reason || 'No reason provided';
      } else {
        return res.status(400).json({ error: 'Action must be approve or reject' });
      }
    }

    await model.update(id, updateData);

    //send notifications 
    
    let user;
    if (type === 'agent') {
      user = await User.findById(entity.user_id);
    } else if (type === 'company') {
      user = await User.findById(entity.created_by);
      console.log(user)
    } else if (type === 'residential' || type === 'commercial') {
      type = type+" property: "+entity.name
      user = await User.findById(entity.added_by);
    }

    // Fallback in case user not found
    const userEmail = user?.email;
    const userName = user?.first_name+" "+user?.last_name || 'User';
    console.log(userEmail + " "+userName + " "+type)

    if (!userEmail) {
      console.warn(`No email found for entity ${type} with ID ${entity.id}`);
    } else {
      if (action === 'approve') {
        await sendApprovalEmail(userEmail, userName, type);
      } else if (action === 'reject') {
        await sendRejectionEmail(userEmail, userName, type, reason || notes);
      }
    }

    res.json({
      message: `${type} ${action}d successfully`,
      id,
      status: updateData.status,
    });
  } catch (err) {
    logger.error('Approval error: ' + err);
    next(err);
  }
};
