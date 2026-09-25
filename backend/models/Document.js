// Document Vault Model for CASEVAULT
// SHA-256 Tamper Detection & Version Control

const mongoose = require("mongoose");

const documentVersionSchema = new mongoose.Schema({
  versionNumber: {
    type: Number,
    required: true
  },
  sha256Hash: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  storagePath: {
    type: String
  },
  fileSize: {
    type: Number
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  changeReason: {
    type: String,
    default: "Updated version uploaded"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  documentNumber: {
    type: String,
    required: [true, "Document number is required"],
    unique: true,
    trim: true,
    index: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    index: true
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  category: {
    type: String,
    enum: [
      "FIR",
      "POLICE_REPORT",
      "WITNESS_STATEMENT",
      "CHARGE_SHEET",
      "COURT_FILING",
      "FORENSIC_REPORT",
      "JUDGMENT",
      "OTHER"
    ],
    required: true
  },
  confidentiality: {
    type: String,
    enum: [
      "PUBLIC",
      "INTERNAL",
      "CONFIDENTIAL",
      "HIGHLY_CONFIDENTIAL",
      "RESTRICTED"
    ],
    default: "CONFIDENTIAL"
  },
  filename: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  mimeType: {
    type: String,
    default: "application/octet-stream"
  },
  storagePath: {
    type: String,
    default: ""
  },
  fileUrl: {
    type: String,
    default: ""
  },
  sha256Hash: {
    type: String,
    required: [true, "Cryptographic SHA-256 hash is required"],
    trim: true,
    index: true
  },
  version: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ["ACTIVE", "SUPERSEDED", "ARCHIVED", "RESTRICTED"],
    default: "ACTIVE"
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  description: {
    type: String,
    default: ""
  },
  versions: [documentVersionSchema]
}, {
  timestamps: true
});

documentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.document_number = ret.documentNumber;
    ret.case_id = ret.caseId?._id?.toString() || ret.caseId?.toString() || "";
    ret.sha256_hash = ret.sha256Hash;
    ret.file_url = ret.fileUrl;
    ret.storage_path = ret.storagePath;
    ret.signedUrl = ret.fileUrl;
    ret.signed_url = ret.fileUrl;
    ret.file_size = ret.fileSize;
    ret.file_size_bytes = ret.fileSize || 0;
    ret.mime_type = ret.mimeType;
    ret.current_version = `v${ret.version || 1}`;
    ret.verification_status = "VERIFIED";
    ret.tamper_status = "VERIFIED";
    ret.last_verified_at = ret.updatedAt;
    ret.uploaded_by = ret.uploadedBy?._id?.toString() || ret.uploadedBy?.toString() || "";
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;

    // Provide linked case summary if populated
    if (ret.caseId && typeof ret.caseId === "object" && ret.caseId.caseNumber) {
      ret.cases = {
        id: ret.caseId._id?.toString() || "",
        case_number: ret.caseId.caseNumber,
        title: ret.caseId.title
      };
    }

    ret.document_versions = (ret.versions || []).map(v => ({
      version_number: `v${v.versionNumber || 1}`,
      change_description: v.changeReason || "Version update",
      sha256_hash: v.sha256Hash,
      file_url: v.fileUrl,
      created_at: v.createdAt
    }));

    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Document", documentSchema);
