const express = require("express");
const router = express.Router();
const auditController = require("../controllers/auditController");
const { authenticate } = require("../middleware/auth");

// All authenticated officers can inspect system audit events
router.get("/", authenticate, auditController.getAuditLogs);

module.exports = router;
