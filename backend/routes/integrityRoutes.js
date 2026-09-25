const express = require("express");
const router = express.Router();
const integrityController = require("../controllers/integrityController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, integrityController.getLedger);
router.post("/verify", authenticate, integrityController.verifyLedger);

module.exports = router;
