// Immutable System Audit Log Model for CASEVAULT
// Forensic Tracking of Access, Creations, Modifications, and Security Violations

const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  actorEmail: {
    type: String,
    default: "system"
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  entityType: {
    type: String,
    required: true,
    index: true
  },
  entityId: {
    type: String,
    default: "N/A"
  },
  ipAddress: {
    type: String,
    default: ""
  },
  userAgent: {
    type: String,
    default: ""
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  result: {
    type: String,
    enum: ["SUCCESS", "FAILURE", "BLOCKED"],
    default: "SUCCESS",
    index: true
  },
  errorMessage: {
    type: String,
    default: ""
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false
});

auditLogSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.actor_id = ret.actorId?._id?.toString() || ret.actorId?.toString() || "";
    ret.actor_email = ret.actorEmail;
    ret.entity_type = ret.entityType;
    ret.entity_id = ret.entityId;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
