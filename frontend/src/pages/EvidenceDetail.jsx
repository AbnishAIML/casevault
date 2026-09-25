import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  GitBranch, ArrowLeft, Plus, ShieldCheck, Clock, MapPin,
  CheckCircle2, AlertTriangle, Send
} from "lucide-react";

export default function EvidenceDetail() {
  const { id } = useParams();
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);

  const [transferForm, setTransferForm] = useState({
    action: "TRANSFERRED_FOR_EXAMINATION",
    reason: "",
    location: "",
    newStatus: "IN_FORENSIC_LAB"
  });

  const fetchEvidence = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/evidence/${id}`);
      setEvidence(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch evidence details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvidence();
  }, [id]);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferForm.reason.trim() || !transferForm.location.trim()) {
      alert("Please provide both transfer reason and destination location.");
      return;
    }

    setSubmittingTransfer(true);
    try {
      await api.post(`/evidence/${id}/custody`, transferForm);
      setShowTransferModal(false);
      setTransferForm({
        action: "TRANSFERRED_FOR_EXAMINATION",
        reason: "",
        location: "",
        newStatus: "IN_FORENSIC_LAB"
      });
      await fetchEvidence();
    } catch (err) {
      alert("Custody transfer failed: " + (err.response?.data?.error?.message || err.message));
    } finally {
      setSubmittingTransfer(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading evidence custody record...</div>;
  }

  if (error || !evidence) {
    return (
      <div className="card" style={{ padding: "40px", textAlign: "center" }}>
        <AlertTriangle size={36} color="#DC2626" style={{ margin: "0 auto 12px auto" }} />
        <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Evidence Record Not Found</h3>
        <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "16px" }}>{error}</p>
        <Link to="/evidence" className="btn btn-secondary">
          <ArrowLeft size={14} /> Back to Evidence Locker
        </Link>
      </div>
    );
  }

  const custodySteps = evidence.evidence_custody || [];

  return (
    <div>
      <Link to="/evidence" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#64748B", marginBottom: "14px" }}>
        <ArrowLeft size={14} /> Back to Evidence Locker
      </Link>

      {/* Evidence Summary Card */}
      <div className="card" style={{ padding: "28px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="mono badge badge-dark">{evidence.evidence_number}</span>
              <span className="badge badge-blue">{evidence.status}</span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary-900)", margin: 0 }}>
              {evidence.evidence_type}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "4px 0 0 0" }}>
              Attached Case: <Link to={`/cases/${evidence.case_id}`} style={{ fontWeight: 600 }}>{evidence.cases?.case_number || "Case Dossier"}</Link>
            </p>
          </div>

          <button onClick={() => setShowTransferModal(true)} className="btn btn-primary btn-sm">
            <Send size={14} /> Transfer Custody
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: "18px" }}>
          {evidence.description}
        </p>

        <div style={{ background: "#0F172A", padding: "14px 18px", borderRadius: "10px", color: "#E2E8F0", fontSize: "0.8rem", marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ color: "#94A3B8" }}>BASELINE HARDWARE / MEDIA SHA-256 HASH:</span>
            <span style={{ color: "#10B981" }}>Tamper-Sealed Baseline</span>
          </div>
          <div className="mono" style={{ color: "#60A5FA", wordBreak: "break-all" }}>
            {evidence.sha256_hash}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", fontSize: "0.825rem", borderTop: "1px solid #E2E8F0", paddingTop: "14px" }}>
          <div>
            <span style={{ color: "#64748B", display: "block" }}>Collection Location</span>
            <strong>{evidence.collection_location}</strong>
          </div>
          <div>
            <span style={{ color: "#64748B", display: "block" }}>Current Storage Location</span>
            <strong>{evidence.storage_location}</strong>
          </div>
          <div>
            <span style={{ color: "#64748B", display: "block" }}>Collection Timestamp</span>
            <span>{new Date(evidence.collection_time).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Chain of Custody Timeline */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "20px" }}>
          Permanent Chain of Custody Journey
        </h3>

        {custodySteps.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>Initial custody recorded at collection.</p>
        ) : (
          <div style={{ position: "relative", paddingLeft: "32px" }}>
            {/* Timeline line */}
            <div style={{ position: "absolute", left: "11px", top: "16px", bottom: "16px", width: "2px", background: "#CBD5E1" }} />

            {custodySteps.map((step, idx) => (
              <div key={idx} style={{ position: "relative", marginBottom: "24px" }}>
                {/* Step node */}
                <div style={{
                  position: "absolute",
                  left: "-32px",
                  top: "2px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  {step.step_number || idx + 1}
                </div>

                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                    <span className="mono badge badge-blue">{step.action}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} /> {new Date(step.transferred_at || step.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#334155", margin: "0 0 6px 0" }}>
                    <strong>Reason:</strong> {step.reason}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.8rem", color: "#64748B", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={13} /> {step.location}
                    </span>
                    <span style={{ color: "#059669", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={13} /> Seal Preserved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfer Custody Modal */}
      {showTransferModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,19,43,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "520px", padding: "28px" }}>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "16px" }}>Transfer Evidence Custody</h3>
            <form onSubmit={handleTransferSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "4px" }}>Action / Transfer Type</label>
                <select
                  value={transferForm.action}
                  onChange={e => setTransferForm({ ...transferForm, action: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
                >
                  <option value="TRANSFERRED_FOR_EXAMINATION">Dispatched for Forensic Lab Examination</option>
                  <option value="DEPOSITED_IN_MALKHANA">Deposited in Central Evidence Malkhana</option>
                  <option value="PRESENTED_IN_COURT">Presented as Judicial Trial Exhibit</option>
                  <option value="RETURNED_TO_CUSTODIAN">Returned to Authorized Custodian</option>
                </select>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "4px" }}>New Storage Location *</label>
                <input
                  type="text"
                  placeholder="e.g. CFSL Cyber Lab Secure Room #3 or Court Vault"
                  value={transferForm.location}
                  onChange={e => setTransferForm({ ...transferForm, location: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "4px" }}>Transfer Reason / Statutory Memo *</label>
                <textarea
                  rows={3}
                  placeholder="Formal justification for evidence movement..."
                  value={transferForm.reason}
                  onChange={e => setTransferForm({ ...transferForm, reason: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowTransferModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submittingTransfer} className="btn btn-primary">
                  {submittingTransfer ? "Recording..." : "Record & Anchor Custody Step"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
