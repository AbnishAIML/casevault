// Authentication Controller for CASEVAULT
// Real MongoDB & JWT Integration with Role-Based Access Control
// Immediate active account provisioning with zero email verification friction

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { successResponse, errorResponse } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET || "casevault_super_secure_sha512_jwt_secret_mha_ncrb_2026_protocol";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

/**
 * Register a new Officer / Official account
 * Only Email, Password, and Profession/ID required.
 * Account is active immediately.
 */
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, badgeNumber, designation, roleId } = req.body;

    if (!email || !password) {
      return errorResponse(res, "VALIDATION_ERROR", "Email and password are required.", 400);
    }

    if (password.length < 6) {
      return errorResponse(res, "VALIDATION_ERROR", "Password must be at least 6 characters long.", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const assignedRole = roleId || "INVESTIGATING_OFFICER";
    const userFullName = (fullName && fullName.trim()) || cleanEmail.split("@")[0];

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return errorResponse(
        res,
        "USER_EXISTS",
        "An account with this email address already exists. Please sign in.",
        409
      );
    }

    // Create user in MongoDB
    const user = await User.create({
      email: cleanEmail,
      password, // Automatically hashed by User model pre-save hook
      fullName: userFullName,
      badgeNumber: badgeNumber || "",
      designation: designation || "Officer",
      role: assignedRole,
      isActive: true
    });

    // Record audit event
    try {
      await AuditLog.create({
        actorId: user._id,
        actorEmail: cleanEmail,
        action: "USER_REGISTERED",
        entityType: "USER",
        entityId: user._id.toString(),
        metadata: { role: assignedRole, badgeNumber },
        result: "SUCCESS"
      });
    } catch (auditErr) {
      console.warn("Audit log notice:", auditErr.message);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          badgeNumber: user.badgeNumber,
          designation: user.designation
        }
      },
      "Officer account created successfully! Access granted.",
      201
    );
  } catch (err) {
    console.error("Register error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message || "Registration failed", 500);
  }
};

/**
 * Login with Email and Password
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "VALIDATION_ERROR", "Email and password are required.", 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user and include password for comparison
    const user = await User.findOne({ email: cleanEmail }).select("+password");

    if (!user) {
      // Log failed attempt
      try {
        await AuditLog.create({
          actorEmail: cleanEmail,
          action: "LOGIN_FAILED",
          entityType: "AUTH",
          entityId: "N/A",
          result: "FAILURE",
          errorMessage: "User not found"
        });
      } catch (_) {}

      return errorResponse(res, "INVALID_CREDENTIALS", "Invalid official email or password.", 401);
    }

    if (!user.isActive) {
      return errorResponse(res, "ACCOUNT_INACTIVE", "Your account has been deactivated. Contact administration.", 403);
    }

    // Compare bcrypt password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      try {
        await AuditLog.create({
          actorId: user._id,
          actorEmail: cleanEmail,
          action: "LOGIN_FAILED",
          entityType: "AUTH",
          entityId: user._id.toString(),
          result: "FAILURE",
          errorMessage: "Incorrect password"
        });
      } catch (_) {}

      return errorResponse(res, "INVALID_CREDENTIALS", "Invalid official email or password.", 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log successful login
    try {
      await AuditLog.create({
        actorId: user._id,
        actorEmail: cleanEmail,
        action: "LOGIN_SUCCESS",
        entityType: "AUTH",
        entityId: user._id.toString(),
        metadata: { role: user.role },
        result: "SUCCESS"
      });
    } catch (_) {}

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return successResponse(res, {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        badgeNumber: user.badgeNumber,
        designation: user.designation
      }
    }, "Authentication successful");
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message || "Login failed", 500);
  }
};

/**
 * Get current authenticated user profile
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, "NOT_FOUND", "User profile not found", 404);
    }

    return successResponse(res, user);
  } catch (err) {
    console.error("getMe error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

/**
 * Logout
 */
exports.logout = async (req, res) => {
  try {
    if (req.user?.id) {
      await AuditLog.create({
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: "LOGOUT",
        entityType: "AUTH",
        entityId: req.user.id,
        result: "SUCCESS"
      });
    }
    return successResponse(res, null, "Logged out successfully");
  } catch (err) {
    return successResponse(res, null, "Logged out");
  }
};
