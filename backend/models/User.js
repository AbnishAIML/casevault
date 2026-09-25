// User Model for CASEVAULT
// Role-Based Access Control (RBAC) & Secure Password Hashing

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false // Exclude from normal queries for security
  },
  fullName: {
    type: String,
    trim: true,
    default: ""
  },
  badgeNumber: {
    type: String,
    trim: true,
    default: ""
  },
  designation: {
    type: String,
    trim: true,
    default: "Officer"
  },
  role: {
    type: String,
    enum: [
      "INVESTIGATING_OFFICER",
      "FORENSIC_OFFICER",
      "LEGAL_OFFICER",
      "COURT_USER",
      "SUPER_ADMIN",
      "VIEWER"
    ],
    default: "INVESTIGATING_OFFICER"
  },
  department: {
    type: String,
    default: "General Police Administration"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password before persisting
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Transform to JSON
userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.full_name = ret.fullName;
    ret.badge_number = ret.badgeNumber;
    ret.is_active = ret.isActive;
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);
