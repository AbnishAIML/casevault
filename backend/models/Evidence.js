// Evidence Locker & Chain of Custody Model for CASEVAULT
// Physical Exhibit and Forensic Digital Seizure Tracking

const mongoose = require("mongoose");

const custodyStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  previousCustodianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  newCustodianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  evidenceHashAtTransfer: {
    type: String,
    required: true
  },
  transferredAt: {
    type: Date,
    default: Date.now
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { _id: false });

const evidenceSchema = new mongoose.Schema({
  evidenceNumber: {
    type: String,
    required: [true, "Evidence number is required"],
    unique: true,
    trim: true,
    index: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
    index: true
  },
  evidenceType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  collectionTime: {
    type: Date,
    default: Date.now
  },
  collectionLocation: {
    type: String,
    required: true
  },
  currentCustodianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  storageLocation: {
    type: String,
    required: true
  },
  sha256Hash: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: [
      "COLLECTED",
      "IN_TRANSIT",
      "IN_FORENSIC_LAB",
      "EXAMINED_IN_LAB",
      "STORED_IN_MALKHANA",
      "PRESENTED_IN_COURT",
      "RETURNED",
      "DISPOSED"
    ],
    default: "COLLECTED"
  },
  fileUrl: {
    type: String,
    default: ""
  },
  storagePath: {
    type: String,
    default: ""
  },
  chainOfCustody: [custodyStepSchema]
}, {
  timestamps: true
});

evidenceSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.evidence_number = ret.evidenceNumber;
    ret.case_id = ret.caseId?._id?.toString() || ret.caseId?.toString() || "";
    ret.evidence_type = ret.evidenceType;
    ret.storage_location = ret.storageLocation;
    ret.collection_location = ret.collectionLocation;
    ret.collection_time = ret.collectionTime;
    ret.sha256_hash = ret.sha256Hash;
    ret.file_url = ret.fileUrl;
    ret.storage_path = ret.storagePath;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;

    if (ret.caseId && typeof ret.caseId === "object" && ret.caseId.caseNumber) {
      ret.cases = {
        id: ret.caseId._id?.toString() || "",
        case_number: ret.caseId.caseNumber,
        title: ret.caseId.title
      };
    }

    ret.evidence_custody = (ret.chainOfCustody || []).map(c => ({
      step_number: c.stepNumber,
      action: c.action,
      reason: c.reason,
      location: c.location,
      evidence_hash_at_transfer: c.evidenceHashAtTransfer,
      transferred_at: c.transferredAt,
      new_custodian_id: c.newCustodianId?.toString() || "",
      previous_custodian_id: c.previousCustodianId?.toString() || ""
    }));

    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Evidence", evidenceSchema);
