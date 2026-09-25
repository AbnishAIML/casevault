// ====================================================================
// CASEVAULT REST API SERVER (MongoDB + Cloudinary + Express)
// Problem Statement: 26190 (Ministry of Home Affairs / NCRB Women Safety Division)
// Theme: Blockchain & Cybersecurity
// ====================================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");

const { connectDB, isMongoConnected } = require("./config/db");
const { isCloudinaryConfigured } = require("./config/cloudinary");

const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes");
const documentRoutes = require("./routes/documentRoutes");
const evidenceRoutes = require("./routes/evidenceRoutes");
const integrityRoutes = require("./routes/integrityRoutes");
const auditRoutes = require("./routes/auditRoutes");
const reportRoutes = require("./routes/reportRoutes");

// Initialize MongoDB connection
connectDB();

const app = express();

// Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes("localhost") || origin === allowedOrigin) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Static route for local uploads storage
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests from this IP, please try again after 15 minutes."
    }
  }
});
app.use("/api", limiter);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    system: "CASEVAULT — Secure Legal & Investigation Document Management System",
    problemStatement: "26190 (Ministry of Home Affairs / NCRB)",
    timestamp: new Date().toISOString(),
    database: "MongoDB",
    mongoConnected: isMongoConnected(),
    cloudinaryConfigured: isCloudinaryConfigured()
  });
});

// Mount Modular API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/integrity", integrityRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/reports", reportRoutes);

// Central Structured Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected system error occurred."
    }
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`CASEVAULT API Server running on port ${PORT}`);
  console.log(`Database: MongoDB (Connected: ${isMongoConnected()})`);
  console.log(`Cloud Storage: Cloudinary (Configured: ${isCloudinaryConfigured()})`);
  console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is currently in use. Please close any previous instance running on port ${PORT} or configure PORT in backend/.env.`);
  } else {
    console.error("Server listener error:", err);
  }
});
