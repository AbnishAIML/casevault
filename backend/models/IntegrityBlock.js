// Cryptographic Integrity Ledger Model for CASEVAULT
// Append-Only Hash-Chain: SHA256(previousHash + eventData)

const mongoose = require("mongoose");

const integrityBlockSchema = new mongoose.Schema({
  blockNumber: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  previousHash: {
    type: String,
    required: true
  },
  currentHash: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    required: true
  },
  entityId: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: false // Ledger blocks are immutable with explicit block timestamp
});

integrityBlockSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.block_number = ret.blockNumber;
    ret.event_id = ret.eventId;
    ret.previous_hash = ret.previousHash;
    ret.current_hash = ret.currentHash;
    ret.event_type = ret.eventType;
    ret.entity_type = ret.entityType;
    ret.entity_id = ret.entityId;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("IntegrityBlock", integrityBlockSchema);
