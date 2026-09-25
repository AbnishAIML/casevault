import { useState, useEffect } from "react";
import api from "../services/api";
import { BarChart3, Download, RefreshCw, Briefcase, FileText, Server, ShieldCheck } from "lucide-react";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/stats");
      setStats(res.data.data || res.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Cases,${stats?.totalCases || 0}\n` +
      `Active Cases,${stats?.activeCases || 0}\n` +
      `Total Documents,${stats?.totalDocuments || 0}\n` +
      `Verified Documents,${stats?.verifiedDocuments || 0}\n` +
      `Evidence Records,${stats?.evidenceRecords || 0}\n` +
      `Storage MB,${stats?.storageUsedMB || 0}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CASEVAULT_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)", marginBottom: "4px" }}>
            Analytical Reports &amp; Statistics
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Statistical breakdown of legal cases, document classification tiers, and storage metrics.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchStats} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary btn-sm">
            <Download size={14} /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Cases</span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "4px" }}>{stats?.totalCases || 0}</div>
          <span style={{ fontSize: "0.75rem", color: "#2563EB" }}>{stats?.activeCases || 0} active</span>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Documents</span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "4px" }}>{stats?.totalDocuments || 0}</div>
          <span style={{ fontSize: "0.75rem", color: "#059669" }}>{stats?.verifiedDocuments || 0} verified</span>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Tamper Verification Rate</span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "4px", color: "#059669" }}>
            {stats?.verificationRate || "100%"}
          </div>
          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Bit-exact integrity match</span>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Storage Consumed</span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "4px" }}>{stats?.storageUsedMB || "0.00"} MB</div>
          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Encrypted private vault</span>
        </div>
      </div>

      {/* Breakdown Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "16px" }}>Cases by Investigation Status</h3>
          {stats?.casesByStatus && Object.keys(stats.casesByStatus).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.entries(stats.casesByStatus).map(([status, count]) => (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: "6px", fontSize: "0.85rem" }}>
                  <span className="mono">{status}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "#64748B" }}>No status data recorded yet.</p>
          )}
        </div>

        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "16px" }}>Documents by Classification Tier</h3>
          {stats?.docsByCategory && Object.keys(stats.docsByCategory).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.entries(stats.docsByCategory).map(([cat, count]) => (
                <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: "6px", fontSize: "0.85rem" }}>
                  <span className="mono">{cat}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "#64748B" }}>No document classification data recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
