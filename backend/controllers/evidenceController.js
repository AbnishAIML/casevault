// Evidence Locker Controller for CASEVAULT
// Real MongoDB & Cloudinary Integration with Immutable Chain of Custody

const Evidence = require("../models/Evidence");
const Case = require("../models/Case");
const AuditLog = require("../models/AuditLog");
const { computeSha256, recordLedgerBlock } = require("../utils/crypto");
const { uploadToCloudinary } = require("../config/cloudinary");
const { successResponse, errorResponse } = require("../utils/response");

exports.getEvidence = async (req, res) => {
  try {
    const { caseId, status } = req.query;

    const filter = {};
    if (caseId) filter.caseId = caseId;
    if (status) filter.status = status;

    const evidenceList = await Evidence.find(filter)
      .sort({ createdAt: -1 })
      .populate("caseId", "caseNumber title");

    return successResponse(res, evidenceList || []);
  } catch (err) {
    console.error("getEvidence error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.getEvidenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const evidence = await Evidence.findById(id).populate("caseId");
    if (!evidence) {
      return errorResponse(res, "NOT_FOUND", "Evidence item not found in locker", 404);
    }

    return successResponse(res, evidence);
  } catch (err) {
    console.error("getEvidenceById error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.createEvidence = async (req, res) => {
  try {
    const {
      caseId,
      evidenceType,
      description,
      collectionLocation,
      storageLocation,
      status = "COLLECTED"
    } = req.body;

    if (!caseId || !evidenceType || !description || !collectionLocation || !storageLocation) {
      return errorResponse(res, "VALIDATION_ERROR", "Case, evidence type, description, and locations are required.", 400);
    }

    const evidenceNumber = `EVD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    let sha256Hash;
    let fileUrl = "";
    let storagePath = "";

    // If file exhibit attached
    if (req.file) {
      sha256Hash = computeSha256(req.file.buffer);
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "casevault/evidence",
          public_id: `${evidenceNumber}_${req.file.sanitizedFilename || "exhibit"}`
        });
        fileUrl = uploadResult.secure_url;
        storagePath = uploadResult.public_id;
      } catch (uploadErr) {
        console.warn("Cloudinary upload notice:", uploadErr.message);
      }
    } else {
      // Cryptographic hash of physical exhibit seizure record
      sha256Hash = computeSha256(`${evidenceNumber}|${caseId}|${evidenceType}|${collectionLocation}|${Date.now()}`);
    }

    const newEvidence = await Evidence.create({
      evidenceNumber,
      caseId,
      evidenceType,
      description,
      collectedBy: req.user?.id || null,
      collectionTime: new Date(),
      collectionLocation,
      currentCustodianId: req.user?.id || null,
      storageLocation,
      sha256Hash,
      status,
      fileUrl,
      storagePath,
      chainOfCustody: [{
        stepNumber: 1,
        previousCustodianId: null,
        newCustodianId: req.user?._id || req.user?.id,
        action: "INITIAL_SEIZURE",
        reason: "Initial forensic exhibit recovery and seizure",
        location: collectionLocation,
        evidenceHashAtTransfer: sha256Hash,
        transferredAt: new Date(),
        actorId: req.user?._id || req.user?.id
      }]
    });

    // Anchor in Cryptographic Hash-Chain Ledger
    await recordLedgerBlock({
      eventType: "EVIDENCE_LOGGED",
      entityType: "EVIDENCE",
      entityId: newEvidence._id.toString(),
      metadata: {
        evidenceNumber: newEvidence.evidenceNumber,
        evidenceType: newEvidence.evidenceType,
        sha256Hash: newEvidence.sha256Hash,
        caseId: newEvidence.caseId.toString()
      },
      actorId: req.user?.id || null
    });

    // Log in immutable audit trail
    try {
      await AuditLog.create({
        actorId: req.user?.id || null,
        actorEmail: req.user?.email || "system",
        action: "EVIDENCE_LOGGED",
        entityType: "EVIDENCE",
        entityId: newEvidence._id.toString(),
        metadata: { evidenceNumber: newEvidence.evidenceNumber, sha256Hash },
        result: "SUCCESS"
      });
    } catch (_) {}

    return successResponse(res, newEvidence, "Evidence item registered and chain of custody initiated", 201);
  } catch (err) {
    console.error("createEvidence error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.transferCustody = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCustodianId, action, reason, location, newStatus } = req.body;

    if (!action || !reason || !location) {
      return errorResponse(res, "VALIDATION_ERROR", "Action, reason, and destination location are required", 400);
    }

    const targetCustodianId = newCustodianId || req.user?.id || null;

    const evidence = await Evidence.findById(id);
    if (!evidence) {
      return errorResponse(res, "NOT_FOUND", "Evidence item not found", 404);
    }

    const previousCustodianId = evidence.currentCustodianId;
    const stepNumber = (evidence.chainOfCustody || []).length + 1;

    if (targetCustodianId) evidence.currentCustodianId = targetCustodianId;
    evidence.storageLocation = location;
    if (newStatus) evidence.status = newStatus;

    evidence.chainOfCustody.push({
      stepNumber,
      previousCustodianId,
      newCustodianId: targetCustodianId,
      action,
      reason,
      location,
      evidenceHashAtTransfer: evidence.sha256Hash,
      transferredAt: new Date(),
      actorId: req.user?.id || null
    });

    await evidence.save();

    // Anchor transfer in cryptographic ledger
    await recordLedgerBlock({
      eventType: "CUSTODY_TRANSFERRED",
      entityType: "EVIDENCE",
      entityId: evidence._id.toString(),
      metadata: {
        evidenceNumber: evidence.evidenceNumber,
        action,
        reason,
        stepNumber,
        newCustodianId
      },
      actorId: req.user?.id || null
    });

    // Audit log
    try {
      await AuditLog.create({
        actorId: req.user?.id || null,
        actorEmail: req.user?.email || "system",
        action: "CUSTODY_TRANSFERRED",
        entityType: "EVIDENCE",
        entityId: evidence._id.toString(),
        metadata: { evidenceNumber: evidence.evidenceNumber, stepNumber, action },
        result: "SUCCESS"
      });
    } catch (_) {}

    return successResponse(res, evidence, "Chain of custody updated and cryptographically anchored");
  } catch (err) {
    console.error("transferCustody error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};
