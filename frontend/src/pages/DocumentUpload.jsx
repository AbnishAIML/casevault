import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import { computeSha256 } from "../utils/cryptoUtils";
import { Upload, ArrowLeft, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

export default function DocumentUpload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCaseId = searchParams.get("caseId") || "";

  const [cases, setCases] = useState([]);
  const [file, setFile] = useState(null);
  const [computedHash, setComputedHash] = useState("");
  const [hashing, setHashing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    caseId: preselectedCaseId,
    title: "",
    category: "FIR",
    confidentiality: "CONFIDENTIAL",
    description: ""
  });

  useEffect(() => {
    // Fetch available cases for dropdown
    api.get("/cases").then(res => {
      const data = res.data.data?.cases || res.data.cases || res.data || [];
      setCases(Array.isArray(data) ? data : []);
      if (!form.caseId && data.length > 0) {
        setForm(prev => ({ ...prev, caseId: data[0].id }));
      }
    }).catch(err => console.error(err));
  }, []);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setError(null);
    if (!form.title) {
      setForm(prev => ({ ...prev, title: selected.name.replace(/\.[^/.]+$/, "") }));
    }

    // Compute genuine SHA-256 hash immediately in browser
    setHashing(true);
    try {
      const buf = await selected.arrayBuffer();
      const hash = await computeSha256(buf);
      setComputedHash(hash);
    } catch (err) {
      console.error("Hashing error:", err);
    } finally {
      setHashing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }
    if (!form.caseId) {
      setError("Please select a target case for this document.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseId", form.caseId);
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("confidentiality", form.confidentiality);
      formData.append("description", form.description);

      const res = await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const doc = res.data.data || res.data;
      navigate(`/documents/${doc.id || ""}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/documents" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#64748B", marginBottom: "8px" }}>
          <ArrowLeft size={14} /> Back to Document Vault
        </Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)" }}>
          Upload Document to Secure Vault
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
          Every uploaded file is automatically processed with a SHA-256 digest and anchored in the cryptographic integrity ledger.
        </p>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: "28px" }}>
        {/* File Dropzone */}
        <div style={{
          border: "2px dashed #CBD5E1",
          borderRadius: "12px",
          padding: "32px 20px",
          textAlign: "center",
          background: file ? "#F0FDF4" : "#F8FAFC",
          marginBottom: "20px",
          cursor: "pointer",
          position: "relative"
        }}>
          <input
            type="file"
            onChange={handleFileChange}
            required
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              width: "100%",
              height: "100%"
            }}
          />

          {file ? (
            <div>
              <CheckCircle2 size={36} color="#10B981" style={{ margin: "0 auto 8px auto" }} />
              <h4 style={{ fontSize: "1rem", margin: "0 0 4px 0" }}>{file.name}</h4>
              <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0 }}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "Document"}
              </p>
            </div>
          ) : (
            <div>
              <Upload size={36} color="#3B82F6" style={{ margin: "0 auto 8px auto" }} />
              <h4 style={{ fontSize: "1rem", margin: "0 0 4px 0" }}>Drag and drop document file or click to browse</h4>
              <p style={{ fontSize: "0.775rem", color: "#64748B", margin: 0 }}>
                Supported formats: PDF, PNG, JPG, TIFF, DOCX, TXT (Maximum file size: 50 MB)
              </p>
            </div>
          )}
        </div>

        {/* Real-time Computed SHA-256 Digest Preview */}
        {file && (
          <div style={{ background: "#0F172A", padding: "14px 18px", borderRadius: "8px", marginBottom: "20px", color: "#E2E8F0", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "#94A3B8" }}>COMPUTED CLIENT-SIDE SHA-256 (WebCrypto):</span>
              <span style={{ color: "#10B981" }}>{hashing ? "Hashing..." : "Ready to Anchor"}</span>
            </div>
            <div className="mono" style={{ color: "#34D399", wordBreak: "break-all" }}>
              {hashing ? "Computing bit-level digest..." : computedHash}
            </div>
          </div>
        )}

        {/* Metadata Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              Target Investigation Case *
            </label>
            <select
              value={form.caseId}
              onChange={e => setForm({ ...form, caseId: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="">Select Case File</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.case_number} — {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              Document Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Certified True Copy of FIR"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              Document Category
            </label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="FIR">First Information Report (FIR)</option>
              <option value="POLICE_REPORT">Police Investigation Report</option>
              <option value="WITNESS_STATEMENT">Witness Statement (Sec 161 CrPC)</option>
              <option value="CHARGE_SHEET">Final Charge Sheet (Sec 173 CrPC)</option>
              <option value="COURT_FILING">Court Filing / Judicial Petition</option>
              <option value="FORENSIC_REPORT">Forensic Laboratory Examination (CFSL)</option>
              <option value="EVIDENCE_RECORD">Evidence Seizure Memo</option>
              <option value="LEGAL_NOTICE">Legal Notice / Summons</option>
              <option value="JUDGMENT">Court Judgment / Order</option>
              <option value="OTHER">Other Classified Document</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
              Confidentiality Tier
            </label>
            <select
              value={form.confidentiality}
              onChange={e => setForm({ ...form, confidentiality: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            >
              <option value="PUBLIC">PUBLIC (General Access)</option>
              <option value="INTERNAL">INTERNAL (Departmental Use Only)</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL (Assigned Team Only)</option>
              <option value="HIGHLY_CONFIDENTIAL">HIGHLY CONFIDENTIAL (Senior Officers Only)</option>
              <option value="RESTRICTED">RESTRICTED (Judicial / Lab Cleared Only)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, marginBottom: "6px" }}>
            Document Description / Remarks
          </label>
          <textarea
            rows={3}
            placeholder="Details on exhibit origin, annexures included, or specific sections referenced..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", lineHeight: 1.5 }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #E2E8F0", paddingTop: "18px" }}>
          <Link to="/documents" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={uploading || hashing} className="btn btn-accent">
            <ShieldCheck size={16} />
            {uploading ? "Encrypting & Storing in Vault..." : "Upload & Anchor Cryptographic Hash"}
          </button>
        </div>
      </form>
    </div>
  );
}
