// Authentication and Authorization Middleware for CASEVAULT
// Verifies JWT against User records in MongoDB with strict RBAC enforcement

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET || "casevault_super_secure_sha512_jwt_secret_mha_ncrb_2026_protocol";

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "UNAUTHORIZED", "Missing or invalid authorization token", 401);
    }

    const token = authHeader.split(" ")[1]?.trim();
    if (!token || token === "null" || token === "undefined") {
      return errorResponse(res, "UNAUTHORIZED", "Missing or invalid authorization token", 401);
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return errorResponse(res, "TOKEN_EXPIRED", "Session expired or invalid token. Please sign in again.", 401);
    }

    if (!decoded || !decoded.id) {
      return errorResponse(res, "UNAUTHORIZED", "Invalid token payload", 401);
    }

    // Lookup user in MongoDB
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return errorResponse(res, "USER_INACTIVE", "Officer profile is deactivated or does not exist", 401);
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName || user.email.split("@")[0],
      badgeNumber: user.badgeNumber || "",
      designation: user.designation || "Officer"
    };

    next();
  } catch (err) {
    console.error("Authentication middleware error:", err);
    return errorResponse(res, "SERVER_ERROR", "Authentication verification failed", 500);
  }
}

/**
 * Role-Based Access Control (RBAC) middleware
 */
function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "UNAUTHORIZED", "Authentication required", 401);
    }

    if (req.user.role === "SUPER_ADMIN" || allowed.includes(req.user.role)) {
      return next();
    }

    return errorResponse(
      res,
      "FORBIDDEN",
      `Access denied. Role '${req.user.role}' is not authorized for this operation.`,
      403
    );
  };
}

function authorizeRoles(...roles) {
  return requireRole(roles);
}

module.exports = {
  authenticate,
  authorizeRoles,
  requireRole
};

