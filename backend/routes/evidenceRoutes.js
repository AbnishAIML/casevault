const express = require("express");
const router = express.Router();
const evidenceController = require("../controllers/evidenceController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, evidenceController.getEvidence);
router.post("/", authenticate, evidenceController.createEvidence);
router.get("/:id", authenticate, evidenceController.getEvidenceById);
router.post("/:id/custody", authenticate, evidenceController.transferCustody);

module.exports = router;
