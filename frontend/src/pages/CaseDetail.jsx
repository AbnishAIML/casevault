import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  Briefcase, FileText, GitBranch, ArrowLeft, Plus, ShieldCheck,
  Clock, MapPin, AlertTriangle, FileCheck, ArrowRight
} from "lucide-react";

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchCaseDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/cases/${id}`);
      setCaseData(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load case dossier from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCaseDetails();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading case dossier...</div>;
  }

  if (error || !caseData) {
    return (
      <div className="card" style={{ padding: "40px", textAlign: "center" }}>
        <AlertTriangle size={36} color="#DC2626" style={{ margin: "0 auto 12px auto" }} />
        <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Case Dossier Not Found</h3>
        <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "16px" }}>{error || "The requested case could not be retrieved."}</p>
        <Link to="/cases" className="btn btn-secondary">
          <ArrowLeft size={14} /> Back to Case List
        </Link>
      </div>
    );
  }

  const documents = caseData.documents || [];
  const evidence = caseData.evidence || [];

  return (
    <div>
      {/* Back Link */}
      <Link to="/cases" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#64748B", marginBottom: "14px" }}>
        <ArrowLeft size={14} /> Back to All Cases
      </Link>

      {/* Case Header Card */}
      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="mono badge badge-blue">{caseData.case_number}</span>
              <span className={`badge ${caseData.priority === 'CRITICAL' ? 'badge-red' : caseData.priority === 'HIGH' ? 'badge-amber' : 'badge-slate'}`}>
                {caseData.priority} PRIORITY
              </span>
              <span className="badge badge-green">{caseData.status}</span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary-900)", margin: 0 }}>
              {caseData.title}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "4px 0 0 0" }}>
              FIR: <span className="mono" style={{ color: "#2563EB", fontWeight: 600 }}>{caseData.fir_number}</span> • Station: {caseData.police_station}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <Link to={`/documents/upload?caseId=${caseData.id}`} className="btn btn-accent btn-sm">
              <Plus size={14} /> Upload Document
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", gap: "20px" }}>
          {[
            { id: "overview", label: "Case Overview" },
            { id: "documents", label: `Documents (${documents.length})` },
            { id: "evidence", label: `Evidence Locker (${evidence.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                padding: "8px 0 12px 0",
                fontSize: "0.875rem",
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "#2563EB" : "#64748B",
                borderBottom: activeTab === tab.id ? "2px solid #2563EB" : "none",
                cursor: "pointer"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Case Synopsis</h3>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {caseData.description || "No detailed synopsis has been provided for this case file yet."}
            </p>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <h4 style={{ fontSize: "0.95rem", marginBottom: "14px" }}>Incident Metadata</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.825rem" }}>
              <div>
                <span style={{ color: "#64748B", display: "block" }}>Case Category</span>
                <strong>{caseData.case_type}</strong>
              </div>
              <div>
                <span style={{ color: "#64748B", display: "block" }}>Location / Area</span>
                <strong>{caseData.location || "Jurisdiction Not Specified"}</strong>
              </div>
              <div>
                <span style={{ color: "#64748B", display: "block" }}>Date Opened</span>
                <strong>{caseData.date_opened || "N/A"}</strong>
              </div>
              <div>
                <span style={{ color: "#64748B", display: "block" }}>Expected Closure Date</span>
                <strong>{caseData.expected_closure_date || "Pending Review"}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.1rem" }}>Case Documents</h3>
            <Link to={`/documents/upload?caseId=${caseData.id}`} className="btn btn-primary btn-sm">
              <Plus size={14} /> Upload to Case
            </Link>
          </div>

          {documents.length === 0 ? (
            <div style={{ padding: "36px", textAlign: "center", color: "#64748B" }}>
              <FileText size={32} color="#94A3B8" style={{ margin: "0 auto 8px auto" }} />
              <p style={{ fontSize: "0.85rem" }}>No documents attached to this case yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                    <th style={{ padding: "10px" }}>Doc ID</th>
                    <th style={{ padding: "10px" }}>Title</th>
                    <th style={{ padding: "10px" }}>Category</th>
                    <th style={{ padding: "10px" }}>Confidentiality</th>
                    <th style={{ padding: "10px" }}>SHA-256 Hash</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="mono" style={{ padding: "12px 10px" }}>{doc.document_number}</td>
                      <td style={{ padding: "12px 10px", fontWeight: 600 }}>{doc.title}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span className="badge badge-slate">{doc.category}</span>
                      </td>
                      <td style={{ padding: "12px 10px" }}>
                        <span className={`badge ${doc.confidentiality === 'CONFIDENTIAL' ? 'badge-amber' : 'badge-slate'}`}>
                          {doc.confidentiality}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px" }}>
                        <span className="mono hash-chip">{doc.sha256_hash ? doc.sha256_hash.substring(0, 16) + "..." : "Pending"}</span>
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <Link to={`/documents/${doc.id}`} className="btn btn-secondary btn-sm" style={{ padding: "4px 10px", fontSize: "0.75rem" }}>
                          Inspect <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.1rem" }}>Physical &amp; Digital Evidence Locker</h3>
            <Link to={`/evidence?caseId=${caseData.id}`} className="btn btn-primary btn-sm">
              <Plus size={14} /> Log Evidence
            </Link>
          </div>

          {evidence.length === 0 ? (
            <div style={{ padding: "36px", textAlign: "center", color: "#64748B" }}>
              <GitBranch size={32} color="#94A3B8" style={{ margin: "0 auto 8px auto" }} />
              <p style={{ fontSize: "0.85rem" }}>No evidence logged for this case yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {evidence.map((ev) => (
                <div key={ev.id} style={{ padding: "14px", border: "1px solid #E2E8F0", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span className="mono badge badge-dark">{ev.evidence_number}</span>
                      <span className="badge badge-blue">{ev.status}</span>
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{ev.evidence_type}</div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748B" }}>{ev.description}</p>
                  </div>
                  <Link to={`/evidence/${ev.id}`} className="btn btn-secondary btn-sm">
                    Chain of Custody <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
