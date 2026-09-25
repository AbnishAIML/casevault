import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Briefcase, Plus, Search, Filter, RefreshCw, AlertTriangle, ArrowRight } from "lucide-react";

export default function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/cases?";
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (statusFilter) url += `status=${statusFilter}&`;
      if (priorityFilter) url += `priority=${priorityFilter}&`;

      const res = await api.get(url);
      const data = res.data.data?.cases || res.data.cases || res.data || [];
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cases from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCases();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)", marginBottom: "4px" }}>
            Case Dossier Management
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Registered First Information Reports (FIRs), judicial tracking, and investigation records.
          </p>
        </div>

        <Link to="/cases/new" className="btn btn-primary">
          <Plus size={16} /> Register New Case
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: "20px" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
            <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search by Case Number, FIR Number, or Title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "6px",
                border: "1px solid #CBD5E1",
                fontSize: "0.85rem"
              }}
            />
          </div>

          <div style={{ minWidth: "160px" }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="IN_COURT">IN COURT</option>
              <option value="CLOSED">CLOSED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div style={{ minWidth: "140px" }}>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: "8px 16px" }}>
            Search
          </button>
        </form>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* Case List Table / Empty State */}
      <div className="card" style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading case files...</div>
        ) : cases.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <Briefcase size={36} color="#94A3B8" style={{ margin: "0 auto 12px auto" }} />
            <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>No Cases Found</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748B", maxWidth: "460px", margin: "0 auto 16px auto" }}>
              No cases matching your search criteria were found in the database.
            </p>
            <Link to="/cases/new" className="btn btn-primary btn-sm">
              <Plus size={15} /> Register New Case
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
                  <th style={{ padding: "10px" }}>Police Station</th>
                  <th style={{ padding: "10px" }}>Priority</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="mono" style={{ padding: "12px 10px", fontWeight: 700 }}>
                      <Link to={`/cases/${c.id}`} style={{ color: "var(--primary-900)" }}>
                        {c.case_number}
                      </Link>
                    </td>
                    <td className="mono" style={{ padding: "12px 10px", color: "#2563EB" }}>
                      {c.fir_number}
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: 500 }}>
                      {c.title}
                    </td>
                    <td style={{ padding: "12px 10px", color: "#64748B", fontSize: "0.8rem" }}>
                      {c.police_station}
                    </td>
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
                        View <ArrowRight size={12} />
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
