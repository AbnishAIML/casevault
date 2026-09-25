const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, caseController.getCases);
router.post("/", authenticate, caseController.createCase);
router.get("/:id", authenticate, caseController.getCaseById);
router.put("/:id", authenticate, caseController.updateCase);
router.put("/:id/archive", authenticate, caseController.archiveCase);

module.exports = router;
