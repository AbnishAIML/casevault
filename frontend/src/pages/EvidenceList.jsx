import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { GitBranch, Plus, Search, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";

export default function EvidenceList() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchEvidence = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/evidence?";
      if (statusFilter) url += `status=${statusFilter}&`;

      const res = await api.get(url);
      const data = res.data.data || res.data || [];
      setEvidence(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch evidence records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [statusFilter]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)", marginBottom: "4px" }}>
            Physical &amp; Digital Evidence Locker
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Forensic seizure management and tamper-sealed Chain of Custody tracking.
          </p>
        </div>

        <Link to="/evidence/new" className="btn btn-primary">
          <Plus size={16} /> Log New Evidence
        </Link>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* Table / Empty State */}
      <div className="card" style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading evidence locker...</div>
        ) : evidence.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <GitBranch size={36} color="#94A3B8" style={{ margin: "0 auto 12px auto" }} />
            <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>No Evidence Records in Locker</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748B", maxWidth: "460px", margin: "0 auto 16px auto" }}>
              Log seized digital media or physical exhibits to initiate permanent chain of custody tracking.
            </p>
            <Link to="/evidence/new" className="btn btn-primary btn-sm">
              <Plus size={15} /> Log First Evidence
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                  <th style={{ padding: "10px" }}>Evidence ID</th>
                  <th style={{ padding: "10px" }}>Type / Nomenclature</th>
                  <th style={{ padding: "10px" }}>Attached Case</th>
                  <th style={{ padding: "10px" }}>Storage Location</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="mono" style={{ padding: "12px 10px", fontWeight: 700 }}>
                      <Link to={`/evidence/${ev.id}`} style={{ color: "var(--primary-900)" }}>
                        {ev.evidence_number}
                      </Link>
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: 600 }}>{ev.evidence_type}</td>
                    <td style={{ padding: "12px 10px", color: "#2563EB" }}>
                      {ev.cases?.case_number || "Case Dossier"}
                    </td>
                    <td style={{ padding: "12px 10px", color: "#64748B" }}>{ev.storage_location}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className="badge badge-blue">{ev.status}</span>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <Link to={`/evidence/${ev.id}`} className="btn btn-secondary btn-sm" style={{ padding: "4px 10px", fontSize: "0.75rem" }}>
                        Custody Trail <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
