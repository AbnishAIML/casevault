import { useState, useEffect } from "react";
import api from "../services/api";
import { Activity, RefreshCw, AlertTriangle, Search, Filter } from "lucide-react";

export default function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFilter, setActionFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/audit?";
      if (actionFilter) url += `action=${actionFilter}&`;
      if (resultFilter) url += `result=${resultFilter}&`;

      const res = await api.get(url);
      const data = res.data.data?.logs || res.data.logs || res.data || [];
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, resultFilter]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)", marginBottom: "4px" }}>
            Immutable System Audit Trail
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Forensic tracking of logins, document verifications, view actions, and blocked unauthorized attempts.
          </p>
        </div>

        <button onClick={fetchLogs} className="btn btn-secondary btn-sm" disabled={loading}>
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh Logs
        </button>
      </div>

      {/* Filter Row */}
      <div className="card" style={{ padding: "14px 20px", marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ minWidth: "200px" }}>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="CASE_CREATED">CASE_CREATED</option>
            <option value="DOCUMENT_UPLOADED">DOCUMENT_UPLOADED</option>
            <option value="DOCUMENT_VIEWED">DOCUMENT_VIEWED</option>
            <option value="DOCUMENT_VERIFIED">DOCUMENT_VERIFIED</option>
            <option value="EVIDENCE_CREATED">EVIDENCE_CREATED</option>
            <option value="EVIDENCE_TRANSFERRED">EVIDENCE_TRANSFERRED</option>
            <option value="LOGIN_FAILED">LOGIN_FAILED</option>
          </select>
        </div>

        <div style={{ minWidth: "160px" }}>
          <select
            value={resultFilter}
            onChange={e => setResultFilter(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
          >
            <option value="">All Results</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="FAILURE">FAILURE</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* Table / Empty State */}
      <div className="card" style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <Activity size={36} color="#94A3B8" style={{ margin: "0 auto 12px auto" }} />
            <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>No Audit Events Recorded</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748B", maxWidth: "460px", margin: "0 auto" }}>
              Every login, case creation, and document verification is captured here automatically.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.825rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                  <th style={{ padding: "10px" }}>Timestamp</th>
                  <th style={{ padding: "10px" }}>Actor Identity</th>
                  <th style={{ padding: "10px" }}>Action</th>
                  <th style={{ padding: "10px" }}>Entity Type</th>
                  <th style={{ padding: "10px" }}>Entity ID</th>
                  <th style={{ padding: "10px" }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="mono" style={{ padding: "10px", color: "#64748B" }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: "10px", fontWeight: 600 }}>
                      {log.actor_email || "System Service"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span className="mono" style={{ fontWeight: 600 }}>{log.action}</span>
                    </td>
                    <td style={{ padding: "10px", color: "#64748B" }}>{log.entity_type}</td>
                    <td className="mono" style={{ padding: "10px", color: "#2563EB" }}>
                      {log.entity_id ? log.entity_id.substring(0, 18) : "N/A"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span className={`badge ${log.result === 'SUCCESS' ? 'badge-green' : 'badge-red'}`}>
                        {log.result}
                      </span>
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
