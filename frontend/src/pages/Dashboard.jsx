import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Briefcase, FileText, GitBranch, ShieldCheck, Cpu, Server,
  Plus, RefreshCw, ArrowRight, AlertTriangle, ShieldAlert
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    totalDocuments: 0,
    verifiedDocuments: 0,
    verificationRate: "100%",
    evidenceRecords: 0,
    ledgerBlocks: 0,
    storageUsedMB: "0.00"
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, casesRes] = await Promise.all([
        api.get("/reports/stats").catch(() => ({ data: { data: {} } })),
        api.get("/cases?limit=5").catch(() => ({ data: { data: { cases: [] } } }))
      ]);

      const statsData = statsRes.data.data || statsRes.data || {};
      setStats({
        totalCases: statsData.totalCases || 0,
        activeCases: statsData.activeCases || 0,
        totalDocuments: statsData.totalDocuments || 0,
        verifiedDocuments: statsData.verifiedDocuments || 0,
        verificationRate: statsData.verificationRate || "100%",
        evidenceRecords: statsData.evidenceRecords || 0,
        ledgerBlocks: statsData.ledgerBlocks || 0,
        storageUsedMB: statsData.storageUsedMB || "0.00"
      });

      const casesList = casesRes.data.data?.cases || casesRes.data.cases || casesRes.data || [];
      setRecentCases(Array.isArray(casesList) ? casesList : []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError("Failed to load live data from backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)", marginBottom: "4px" }}>
            Investigation Command Center
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
            Real-time case files, cryptographic document verification, and evidence chain of custody.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchDashboardData} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh Live Data
          </button>
          <Link to="/cases/new" className="btn btn-primary btn-sm">
            <Plus size={15} /> Register Case
          </Link>
          <Link to="/documents/upload" className="btn btn-accent btn-sm">
            <Plus size={15} /> Upload Document
          </Link>
        </div>
      </div>

      {error && (
        <div style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          color: "#991B1B",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { title: "Total Cases", value: stats.totalCases, icon: Briefcase, color: "#2563EB", sub: `${stats.activeCases} Active Investigations`, link: "/cases" },
          { title: "Vault Documents", value: stats.totalDocuments, icon: FileText, color: "#4F46E5", sub: `${stats.verifiedDocuments} Bit-Exact Verified`, link: "/documents" },
          { title: "Evidence Records", value: stats.evidenceRecords, icon: GitBranch, color: "#059669", sub: "Custody Chain Active", link: "/evidence" },
          { title: "Integrity Verification", value: stats.verificationRate, icon: ShieldCheck, color: "#10B981", sub: "SHA-256 Bit Match Rate", link: "/documents" },
          { title: "Ledger Blocks", value: stats.ledgerBlocks, icon: Cpu, color: "#D97706", sub: "Cryptographic Hash-Chain", link: "/integrity" },
          { title: "Storage Usage", value: `${stats.storageUsedMB} MB`, icon: Server, color: "#7C3AED", sub: "Private Vault Storage", link: "/documents" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link key={idx} to={kpi.link} style={{ textDecoration: "none" }}>
              <div className="card card-hover" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748B" }}>{kpi.title}</span>
                  <div style={{ background: `${kpi.color}15`, padding: "7px", borderRadius: "8px" }}>
                    <Icon size={18} color={kpi.color} />
                  </div>
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)", marginBottom: "4px" }}>
                  {loading ? "..." : kpi.value}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{kpi.sub}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Cases Section */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Recent Legal &amp; Investigation Cases</h3>
            <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0 }}>
              Live records fetched from PostgreSQL database.
            </p>
          </div>
          <Link to="/cases" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2563EB", display: "flex", alignItems: "center", gap: "4px" }}>
            View All Cases <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: "36px", textAlign: "center", color: "#64748B", fontSize: "0.9rem" }}>
            Loading live case records...
          </div>
        ) : recentCases.length === 0 ? (
          /* Proper Empty State */
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{
              background: "#F1F5F9",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto"
            }}>
              <Briefcase size={26} color="#64748B" />
            </div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>No Cases Registered Yet</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748B", maxWidth: "460px", margin: "0 auto 18px auto" }}>
              There are currently no cases in the database. Create your first case file to begin managing legal records and tracking evidence.
            </p>
            <Link to="/cases/new" className="btn btn-primary btn-sm">
              <Plus size={15} /> Register First Case
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                  <th style={{ padding: "10px" }}>Case Number</th>
                  <th style={{ padding: "10px" }}>FIR Number</th>
                  <th style={{ padding: "10px" }}>Title</th>
                  <th style={{ padding: "10px" }}>Priority</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="mono" style={{ padding: "12px 10px", fontWeight: 600 }}>{c.case_number}</td>
                    <td className="mono" style={{ padding: "12px 10px", color: "#2563EB" }}>{c.fir_number}</td>
                    <td style={{ padding: "12px 10px" }}>{c.title}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className={`badge ${c.priority === 'CRITICAL' ? 'badge-red' : c.priority === 'HIGH' ? 'badge-amber' : 'badge-slate'}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className="badge badge-blue">{c.status}</span>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <Link to={`/cases/${c.id}`} className="btn btn-secondary btn-sm" style={{ padding: "4px 10px", fontSize: "0.75rem" }}>
                        View Dossier
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
