// Case Management Controller for CASEVAULT
// Real MongoDB Queries & Cryptographic Ledger Anchoring

const Case = require("../models/Case");
const Document = require("../models/Document");
const Evidence = require("../models/Evidence");
const AuditLog = require("../models/AuditLog");
const { recordLedgerBlock } = require("../utils/crypto");
const { successResponse, errorResponse } = require("../utils/response");

exports.getCases = async (req, res) => {
  try {
    const { status, priority, search, limit = 50, offset = 0 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { caseNumber: { $regex: search, $options: "i" } },
        { firNumber: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { policeStation: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    return successResponse(res, { cases: cases || [], total: total || 0 });
  } catch (err) {
    console.error("getCases error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const caseRecord = await Case.findById(id).populate("createdBy", "fullName email badgeNumber");
    if (!caseRecord) {
      return errorResponse(res, "NOT_FOUND", "Case record not found in database", 404);
    }

    // Fetch related documents and evidence for this case
    const documents = await Document.find({ caseId: id }).sort({ createdAt: -1 });
    const evidence = await Evidence.find({ caseId: id }).sort({ createdAt: -1 });

    const caseData = caseRecord.toJSON();
    caseData.documents = documents;
    caseData.evidence = evidence;

    return successResponse(res, caseData);
  } catch (err) {
    console.error("getCaseById error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.createCase = async (req, res) => {
  try {
    const {
      caseNumber,
      firNumber,
      title,
      description,
      caseType,
      policeStation,
      priority = "MEDIUM",
      location,
      expectedClosureDate
    } = req.body;

    if (!caseNumber || !firNumber || !title || !policeStation) {
      return errorResponse(res, "VALIDATION_ERROR", "Case number, FIR number, title, and police station are required", 400);
    }

    // Check duplicate caseNumber or firNumber
    const existingCase = await Case.findOne({
      $or: [
        { caseNumber: caseNumber.trim() },
        { firNumber: firNumber.trim() }
      ]
    });

    if (existingCase) {
      return errorResponse(
        res,
        "DUPLICATE_CASE",
        "A case with this Case Number or FIR Number already exists.",
        409
      );
    }

    // 1. Confirmed Database Write
    const newCase = await Case.create({
      caseNumber: caseNumber.trim(),
      firNumber: firNumber.trim(),
      title: title.trim(),
      description: description || "",
      caseType: caseType || "General Legal Investigation",
      policeStation: policeStation.trim(),
      priority,
      status: "OPEN",
      location: location || "",
      expectedClosureDate: expectedClosureDate || null,
      createdBy: req.user?.id || null,
      investigatingOfficerId: req.user?.id || null,
      members: req.user?.id ? [{
        userId: req.user.id,
        roleInCase: "Lead Investigating Officer",
        assignedAt: new Date()
      }] : []
    });

    // 2. Anchor in Cryptographic Integrity Ledger
    await recordLedgerBlock({
      eventType: "CASE_CREATED",
      entityType: "CASE",
      entityId: newCase._id.toString(),
      metadata: {
        caseNumber: newCase.caseNumber,
        firNumber: newCase.firNumber,
        title: newCase.title,
        policeStation: newCase.policeStation
      },
      actorId: req.user?.id || null
    });

    // 3. Log in immutable audit trail
    try {
      await AuditLog.create({
        actorId: req.user?.id || null,
        actorEmail: req.user?.email || "system",
        action: "CASE_CREATED",
        entityType: "CASE",
        entityId: newCase._id.toString(),
        metadata: { caseNumber: newCase.caseNumber, firNumber: newCase.firNumber },
        result: "SUCCESS"
      });
    } catch (_) {}

    return successResponse(res, newCase, "Case registered in database and anchored in cryptographic ledger", 201);
  } catch (err) {
    console.error("createCase error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, location, dateClosed } = req.body;

    const caseRecord = await Case.findById(id);
    if (!caseRecord) {
      return errorResponse(res, "NOT_FOUND", "Case record not found in database", 404);
    }

    if (title) caseRecord.title = title;
    if (description !== undefined) caseRecord.description = description;
    if (priority) caseRecord.priority = priority;
    if (location !== undefined) caseRecord.location = location;
    if (dateClosed) caseRecord.dateClosed = dateClosed;

    const oldStatus = caseRecord.status;
    if (status && status !== oldStatus) {
      caseRecord.status = status;
      if (status === "CLOSED" && !caseRecord.dateClosed) {
        caseRecord.dateClosed = new Date();
      }

      // Anchor status transition in cryptographic ledger
      await recordLedgerBlock({
        eventType: "CASE_STATUS_UPDATED",
        entityType: "CASE",
        entityId: caseRecord._id.toString(),
        metadata: {
          caseNumber: caseRecord.caseNumber,
          oldStatus,
          newStatus: status
        },
        actorId: req.user?.id || null
      });
    }

    await caseRecord.save();

    // Audit log
    try {
      await AuditLog.create({
        actorId: req.user?.id || null,
        actorEmail: req.user?.email || "system",
        action: "CASE_UPDATED",
        entityType: "CASE",
        entityId: caseRecord._id.toString(),
        metadata: { status: caseRecord.status, priority: caseRecord.priority },
        result: "SUCCESS"
      });
    } catch (_) {}

    return successResponse(res, caseRecord, "Case updated successfully");
  } catch (err) {
    console.error("updateCase error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.addCaseMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, roleInCase } = req.body;

    if (!userId) {
      return errorResponse(res, "VALIDATION_ERROR", "User ID is required", 400);
    }

    const caseRecord = await Case.findById(id);
    if (!caseRecord) {
      return errorResponse(res, "NOT_FOUND", "Case record not found", 404);
    }

    // Check if member already assigned
    const exists = (caseRecord.members || []).some(m => m.userId.toString() === userId);
    if (exists) {
      return errorResponse(res, "DUPLICATE_MEMBER", "User is already assigned to this case", 409);
    }

    caseRecord.members.push({
      userId,
      roleInCase: roleInCase || "Assigned Officer",
      assignedAt: new Date()
    });

    await caseRecord.save();

    return successResponse(res, caseRecord, "Member assigned to case dossier successfully");
  } catch (err) {
    console.error("addCaseMember error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};

exports.archiveCase = async (req, res) => {
  try {
    const { id } = req.params;
    const caseRecord = await Case.findById(id);
    if (!caseRecord) {
      return errorResponse(res, "NOT_FOUND", "Case record not found", 404);
    }
    caseRecord.status = "ARCHIVED";
    await caseRecord.save();

    await recordLedgerBlock({
      eventType: "CASE_ARCHIVED",
      entityType: "CASE",
      entityId: caseRecord._id.toString(),
      metadata: { caseNumber: caseRecord.caseNumber },
      actorId: req.user?.id || null
    });

    return successResponse(res, caseRecord, "Case dossier archived successfully");
  } catch (err) {
    console.error("archiveCase error:", err);
    return errorResponse(res, "SERVER_ERROR", err.message, 500);
  }
};
