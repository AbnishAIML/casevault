const AuditLog = require("../models/AuditLog");

const logAction = async ({ userId, action, targetDocument = null, details = "", req = null }) => {
  try {
    await AuditLog.create({
      actorId: userId || null,
      action: action || "SYSTEM_ACTION",
      entityType: targetDocument ? "DOCUMENT" : "GENERAL",
      entityId: targetDocument ? String(targetDocument) : "N/A",
      metadata: { details },
      ipAddress: req ? (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip) : "",
      result: "SUCCESS"
    });
  } catch (err) {
    // Auditing must never crash the main request; log to console instead.
    console.warn("Audit log notice:", err.message);
  }
};

module.exports = logAction;
