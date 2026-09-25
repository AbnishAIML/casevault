// Case Dossier Model for CASEVAULT
// First Information Report (FIR) and Legal Proceedings Record

const mongoose = require("mongoose");

const caseMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  roleInCase: {
    type: String,
    default: "Investigating Officer"
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const caseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: [true, "Case number is required"],
    unique: true,
    trim: true,
    index: true
  },
  firNumber: {
    type: String,
    required: [true, "FIR number is required"],
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  caseType: {
    type: String,
    default: "General Legal Investigation"
  },
  policeStation: {
    type: String,
    required: [true, "Police station is required"],
    trim: true
  },
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    default: "MEDIUM"
  },
  status: {
    type: String,
    enum: [
      "OPEN",
      "UNDER_INVESTIGATION",
      "UNDER_REVIEW",
      "SUBMITTED",
      "IN_COURT",
      "CLOSED",
      "ARCHIVED"
    ],
    default: "OPEN"
  },
  location: {
    type: String,
    default: ""
  },
  dateOpened: {
    type: Date,
    default: Date.now
  },
  expectedClosureDate: {
    type: Date
  },
  dateClosed: {
    type: Date
  },
  tags: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  investigatingOfficerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  members: [caseMemberSchema]
}, {
  timestamps: true
});

caseSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.case_number = ret.caseNumber;
    ret.fir_number = ret.firNumber;
    ret.case_type = ret.caseType;
    ret.police_station = ret.policeStation;
    ret.expected_closure_date = ret.expectedClosureDate;
    ret.date_closed = ret.dateClosed;
    ret.date_opened = ret.dateOpened;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    ret.case_members = (ret.members || []).map(m => ({
      id: m.userId?.toString() || "",
      user_id: m.userId?.toString() || "",
      role_in_case: m.roleInCase,
      assigned_at: m.assignedAt
    }));
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Case", caseSchema);
