import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { FileText, Plus, Search, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [confFilter, setConfFilter] = useState("");

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/documents?";
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (categoryFilter) url += `category=${categoryFilter}&`;
      if (confFilter) url += `confidentiality=${confFilter}&`;

      const res = await api.get(url);
      const data = res.data.data || res.data || [];
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch documents from vault.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [categoryFilter, confFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)", marginBottom: "4px" }}>
            Secure Document Vault
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Centralized legal records repository protected by SHA-256 cryptographic tamper detection.
          </p>
        </div>

        <Link to="/documents/upload" className="btn btn-accent">
          <Plus size={16} /> Upload New Document
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: "20px" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
            <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search by Document Number, Title, or Filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            />
          </div>

          <div style={{ minWidth: "160px" }}>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="">All Categories</option>
              <option value="FIR">FIR</option>
              <option value="POLICE_REPORT">POLICE REPORT</option>
              <option value="WITNESS_STATEMENT">WITNESS STATEMENT</option>
              <option value="CHARGE_SHEET">CHARGE SHEET</option>
              <option value="COURT_FILING">COURT FILING</option>
              <option value="FORENSIC_REPORT">FORENSIC REPORT</option>
              <option value="JUDGMENT">JUDGMENT</option>
            </select>
          </div>

          <div style={{ minWidth: "160px" }}>
            <select
              value={confFilter}
              onChange={e => setConfFilter(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="">All Confidentiality</option>
              <option value="PUBLIC">PUBLIC</option>
              <option value="INTERNAL">INTERNAL</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL</option>
              <option value="HIGHLY_CONFIDENTIAL">HIGHLY CONFIDENTIAL</option>
              <option value="RESTRICTED">RESTRICTED</option>
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

      {/* Table / Empty State */}
      <div className="card" style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading vault documents...</div>
        ) : documents.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FileText size={36} color="#94A3B8" style={{ margin: "0 auto 12px auto" }} />
            <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>No Documents in Vault</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748B", maxWidth: "460px", margin: "0 auto 16px auto" }}>
              Upload your first legal document or forensic report to calculate its SHA-256 hash and anchor it in the integrity ledger.
            </p>
            <Link to="/documents/upload" className="btn btn-accent btn-sm">
              <Plus size={15} /> Upload First Document
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                  <th style={{ padding: "10px" }}>Document ID</th>
                  <th style={{ padding: "10px" }}>Document Title</th>
                  <th style={{ padding: "10px" }}>Category</th>
                  <th style={{ padding: "10px" }}>Confidentiality</th>
                  <th style={{ padding: "10px" }}>SHA-256 Hash</th>
                  <th style={{ padding: "10px" }}>Verification</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="mono" style={{ padding: "12px 10px", fontWeight: 700 }}>
                      <Link to={`/documents/${d.id}`} style={{ color: "var(--primary-900)" }}>
                        {d.document_number}
                      </Link>
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: 600 }}>{d.title}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className="badge badge-slate">{d.category}</span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className={`badge ${d.confidentiality === 'CONFIDENTIAL' ? 'badge-amber' : d.confidentiality === 'RESTRICTED' ? 'badge-red' : 'badge-slate'}`}>
                        {d.confidentiality}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className="mono hash-chip">{d.sha256_hash ? d.sha256_hash.substring(0, 16) + "..." : "Pending"}</span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className={`badge ${d.verification_status === 'VERIFIED' ? 'badge-green' : 'badge-red'}`}>
                        ✓ {d.verification_status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <Link to={`/documents/${d.id}`} className="btn btn-secondary btn-sm" style={{ padding: "4px 10px", fontSize: "0.75rem" }}>
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
    </div>
  );
}
