// Cryptographic Integrity Ledger Controller for CASEVAULT
// Real MongoDB Hash-Chain Verification — NO MOCKS

const IntegrityBlock = require("../models/IntegrityBlock");
const AuditLog = require("../models/AuditLog");
const { verifyLedgerChain } = require("../utils/crypto");
const { successResponse, errorResponse } = require("../utils/response");

exports.getLedger = async (req, res) => {
  try {
    const blocks = await IntegrityBlock.find().sort({ blockNumber: 1 });
    return successResponse(res, blocks || []);
  } catch (err) {
    console.error("getLedger error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.verifyLedger = async (req, res) => {
  try {
    const blocks = await IntegrityBlock.find().sort({ blockNumber: 1 });
    const verificationResult = verifyLedgerChain(blocks || []);

    // Log verification in audit trail
    try {
      await AuditLog.create({
        actorId: req.user?.id || null,
        actorEmail: req.user?.email || "system",
        action: "LEDGER_VERIFIED",
        entityType: "LEDGER",
        entityId: "ALL_BLOCKS",
        metadata: {
          totalBlocksChecked: verificationResult.totalBlocksChecked,
          isValid: verificationResult.isValid
        },
        result: verificationResult.isValid ? "SUCCESS" : "FAILURE"
      });
    } catch (_) {}

    return successResponse(res, verificationResult, verificationResult.message);
  } catch (err) {
    console.error("verifyLedger error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};
