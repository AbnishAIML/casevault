// Real Production API & Data Service Layer for CASEVAULT
// All requests flow through the backend Express REST API
// Protected by real JWT sessions, PostgreSQL database queries, and server-side cryptographic hashing.
// NO MOCK DATA, NO FAKE USERS, NO BYPASSES.

import api from "./api";
import { computeSha256 } from "../utils/cryptoUtils";

export const dataService = {
  // 1. CASES
  async getCases(params = {}) {
    const res = await api.get("/cases", { params });
    return res.data.data || res.data || [];
  },

  async getCaseById(id) {
    const res = await api.get(`/cases/${id}`);
    return res.data.data || res.data;
  },

  async createCase(caseData) {
    const res = await api.post("/cases", {
      caseNumber: caseData.caseNumber,
      firNumber: caseData.firNumber,
      title: caseData.title,
      description: caseData.description,
      caseType: caseData.caseType,
      policeStation: caseData.policeStation,
      priority: caseData.priority || "MEDIUM",
      status: caseData.status || "OPEN",
      location: caseData.location,
      dateOpened: caseData.dateOpened || new Date().toISOString().split("T")[0]
    });
    return res.data.data || res.data;
  },

  async updateCase(id, updateData) {
    const res = await api.put(`/cases/${id}`, updateData);
    return res.data.data || res.data;
  },

  async archiveCase(id) {
    const res = await api.put(`/cases/${id}/archive`);
    return res.data.data || res.data;
  },

  // 2. DOCUMENTS
  async getDocuments(caseId = null) {
    const url = caseId ? `/documents?caseId=${encodeURIComponent(caseId)}` : "/documents";
    const res = await api.get(url);
    return res.data.data || res.data || [];
  },

  async getDocumentById(id) {
    const res = await api.get(`/documents/${id}`);
    return res.data.data || res.data;
  },

  async uploadDocument({ file, caseId, title, category, confidentiality, description }) {
    if (!file) throw new Error("A real file is required for upload.");

    // Compute client-side SHA-256 for dual-verification
    const arrayBuffer = await file.arrayBuffer();
    const sha256 = await computeSha256(arrayBuffer);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseId", caseId);
    formData.append("title", title || file.name);
    formData.append("category", category);
    formData.append("confidentiality", confidentiality || "CONFIDENTIAL");
    formData.append("description", description || "");
    formData.append("sha256", sha256);

    const res = await api.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.data || res.data;
  },

  async verifyDocumentIntegrity(documentId) {
    const res = await api.post(`/documents/${documentId}/verify`);
    return res.data.data || res.data;
  },

  // 3. EVIDENCE & CHAIN OF CUSTODY
  async getEvidence(caseId = null) {
    const url = caseId ? `/evidence?caseId=${encodeURIComponent(caseId)}` : "/evidence";
    const res = await api.get(url);
    return res.data.data || res.data || [];
  },

  async getEvidenceById(id) {
    const res = await api.get(`/evidence/${id}`);
    return res.data.data || res.data;
  },

  async createEvidence(evidenceData) {
    const res = await api.post("/evidence", evidenceData);
    return res.data.data || res.data;
  },

  async transferEvidenceCustody(evidenceId, transferData) {
    const res = await api.post(`/evidence/${evidenceId}/custody`, transferData);
    return res.data.data || res.data;
  },

  // 4. INTEGRITY LEDGER (Cryptographic Hash-Chain)
  async getIntegrityLedger() {
    const res = await api.get("/integrity");
    return res.data.data || res.data || [];
  },

  async verifyLedger() {
    const res = await api.post("/integrity/verify");
    return res.data.data || res.data;
  },

  // 5. AUDIT LOGS
  async getAuditLogs(params = {}) {
    const res = await api.get("/audit", { params });
    return res.data.data || res.data || [];
  },

  // 6. SYSTEM STATS & METRICS
  async getStats() {
    const res = await api.get("/reports/stats");
    return res.data.data || res.data;
  }
};

export default dataService;
