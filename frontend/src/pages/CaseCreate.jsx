import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Briefcase, ArrowLeft, ShieldCheck, AlertTriangle } from "lucide-react";

export default function CaseCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    caseNumber: `CR-2026-${Math.floor(1000 + Math.random() * 9000)}-ND`,
    firNumber: `FIR/${Math.floor(10 + Math.random() * 90)}/2026/CYBER`,
    title: "",
    caseType: "Cyber Financial Crime & Extortion",
    policeStation: "Cyber Crime Police Station, Central District",
    priority: "HIGH",
    location: "New Delhi Jurisdiction",
    expectedClosureDate: "",
    description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.policeStation.trim()) {
      setError("Please fill in all mandatory case fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/cases", form);
      const createdCase = res.data.data || res.data;
      navigate(`/cases/${createdCase.id || ""}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || err.message || "Failed to register case");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/cases" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#64748B", marginBottom: "8px" }}>
          <ArrowLeft size={14} /> Back to Case List
        </Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)" }}>
          Register New Investigation Case
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
          Initial First Information Report (FIR) logging and cryptographic ledger anchoring.
        </p>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              Case Reference Number *
            </label>
            <input
              type="text"
              value={form.caseNumber}
              onChange={e => setForm({ ...form, caseNumber: e.target.value })}
              required
              className="mono"
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              FIR Number *
            </label>
            <input
              type="text"
              value={form.firNumber}
              onChange={e => setForm({ ...form, firNumber: e.target.value })}
              required
              className="mono"
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
            Case Title / Incident Nomenclature *
          </label>
          <input
            type="text"
            placeholder="e.g. State vs Syndicate Alpha: Coordinated SIM Swap & Crypto Extortion"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              Case Category
            </label>
            <select
              value={form.caseType}
              onChange={e => setForm({ ...form, caseType: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="Cyber Financial Crime & Extortion">Cyber Financial Crime &amp; Extortion</option>
              <option value="Women Safety & Digital Harassment">Women Safety &amp; Digital Harassment</option>
              <option value="Organized Forgery & Counterfeiting">Organized Forgery &amp; Counterfeiting</option>
              <option value="Forensic Digital Evidence Preservation">Forensic Digital Evidence Preservation</option>
              <option value="Special Investigation Division">Special Investigation Division</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              Priority Level
            </label>
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              Jurisdiction Police Station *
            </label>
            <input
              type="text"
              value={form.policeStation}
              onChange={e => setForm({ ...form, policeStation: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
            Case Synopsis / Initial Deposition Summary
          </label>
          <textarea
            rows={4}
            placeholder="Provide a detailed factual summary of the complaint, initial evidence seized, and investigation scope..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", lineHeight: 1.5 }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #E2E8F0", paddingTop: "18px" }}>
          <Link to="/cases" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <ShieldCheck size={16} />
            {loading ? "Anchoring in Database..." : "Register Case & Anchor Ledger"}
          </button>
        </div>
      </form>
    </div>
  );
}
