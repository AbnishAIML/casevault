// Audit Trail Controller for CASEVAULT
// Real Immutable System Audit Logging from MongoDB — NO MOCKS

const AuditLog = require("../models/AuditLog");
const { successResponse, errorResponse } = require("../utils/response");

exports.getAuditLogs = async (req, res) => {
  try {
    const { action, entityType, result, limit = 100, offset = 0 } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;
    if (result) filter.result = result;

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    return successResponse(res, { logs: logs || [], total: total || 0 });
  } catch (err) {
    console.error("getAuditLogs error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};
