const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticate } = require("../middleware/auth");

router.get("/stats", authenticate, reportController.getStats);

module.exports = router;
