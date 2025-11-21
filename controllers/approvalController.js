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
      return res.json(errorResponse("Unauthorized!", "Only admins can perform approvals or verifications.", 403))
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
      return res.json(errorResponse("Invalid!", "Invalid approval type.", 400))
    }

    const entity = await model.findById(id);
    if (!entity) {
      return res.json(errorResponse("Not found!", `${type} not found`, 404))
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
        return res.json(errorResponse("Invalid Action!", "Action must be approve or reject.", 400))
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
        return res.json(errorResponse("Invalid Action!", "Action must be approve or reject.", 400))
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
      type = type + " property: " + entity.name
      user = await User.findById(entity.added_by);
    }

    // Fallback in case user not found
    const userEmail = user?.email;
    const userName = user?.first_name + " " + user?.last_name || 'User';
    console.log(userEmail + " " + userName + " " + type)

    if (!userEmail) {
      logger.error(`No email found for entity ${type} with ID ${entity.id}`);
    } else {
      if (action === 'approve') {
        sendApprovalEmail(userEmail, userName, type);
      } else if (action === 'reject') {
        sendRejectionEmail(userEmail, userName, type, reason || notes);
      }
    }

    const response = {
      id,
      status: updateData.status,
    };
    return res.json(successResponse(`${type} ${action}d successfully`, response, 201))
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
