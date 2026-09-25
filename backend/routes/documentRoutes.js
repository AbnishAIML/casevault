const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { authenticate } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", authenticate, documentController.getDocuments);
router.post("/", authenticate, upload.single("file"), documentController.uploadDocument);
router.get("/:id", authenticate, documentController.getDocumentById);
router.post("/:id/verify", authenticate, documentController.verifyDocument);
router.post("/:id/versions", authenticate, upload.single("file"), documentController.createVersion);

module.exports = router;
