import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  FileText, ArrowLeft, ShieldCheck, ShieldAlert, Cpu, Download,
  Clock, CheckCircle2, AlertTriangle, Layers, ExternalLink, RefreshCw
} from "lucide-react";

export default function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/documents/${id}`);
      setDoc(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch document record from vault.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDocument();
  }, [id]);

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const res = await api.post(`/documents/${id}/verify`);
      setVerificationResult(res.data.data || res.data);
      // Refresh to update last_verified_at in state
      await fetchDocument();
    } catch (err) {
      console.error(err);
      setError("Integrity verification check failed: " + (err.response?.data?.error?.message || err.message));
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading vault document...</div>;
  }

  if (error || !doc) {
    return (
      <div className="card" style={{ padding: "40px", textAlign: "center" }}>
        <AlertTriangle size={36} color="#DC2626" style={{ margin: "0 auto 12px auto" }} />
        <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Document Record Not Found</h3>
        <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "16px" }}>{error || "Could not retrieve document."}</p>
        <Link to="/documents" className="btn btn-secondary">
          <ArrowLeft size={14} /> Back to Document Vault
        </Link>
      </div>
    );
  }

  const versions = doc.document_versions || [];

  return (
    <div>
      <Link to="/documents" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#64748B", marginBottom: "14px" }}>
        <ArrowLeft size={14} /> Back to Document Vault
      </Link>

      {/* Main Document Inspector Card */}
      <div className="card" style={{ padding: "28px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span className="mono badge badge-blue">{doc.document_number}</span>
              <span className="badge badge-slate">{doc.category}</span>
              <span className={`badge ${doc.confidentiality === 'CONFIDENTIAL' ? 'badge-amber' : 'badge-slate'}`}>
                {doc.confidentiality}
              </span>
              <span className="badge badge-dark">{doc.current_version}</span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary-900)", margin: 0 }}>
              {doc.title}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "4px 0 0 0" }}>
              Attached Case: <Link to={`/cases/${doc.case_id}`} style={{ fontWeight: 600 }}>{doc.cases?.case_number || "Case Dossier"}</Link>
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {doc.signedUrl && (
              <a href={doc.signedUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                <Download size={14} /> Download File
              </a>
            )}
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="btn btn-primary btn-sm"
            >
              <Cpu size={14} />
              {verifying ? "Executing Check..." : "Verify Cryptographic Integrity"}
            </button>
          </div>
        </div>

        {/* Verification Result Banner */}
        {verificationResult && (
          <div style={{
            padding: "16px 20px",
            borderRadius: "10px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: verificationResult.verified ? "#ECFDF5" : "#FEF2F2",
            border: `1px solid ${verificationResult.verified ? "#A7F3D0" : "#FECACA"}`,
            color: verificationResult.verified ? "#065F46" : "#991B1B"
          }}>
            {verificationResult.verified ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
            <div>
              <h4 style={{ margin: 0, fontSize: "0.95rem" }}>
                {verificationResult.verified
                  ? "✓ INTEGRITY VERIFIED (Bit-Exact Match Confirmed)"
                  : "⚠ INTEGRITY COMPROMISED (Cryptographic Hash Mismatch Detected!)"}
              </h4>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem" }}>
                {verificationResult.verified
                  ? "The downloaded file binary perfectly matches the cryptographic hash anchored at upload. No unauthorized modification detected."
                  : "The current document bytes differ from the immutable baseline hash. The file may have suffered unauthorized alteration or corruption."}
              </p>
            </div>
          </div>
        )}

        {/* Hash Details Box */}
        <div style={{
          background: "#0F172A",
          color: "#E2E8F0",
          padding: "18px 20px",
          borderRadius: "12px",
          marginBottom: "20px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>ANCHORED SHA-256 HASH (Recorded at Upload):</span>
            <span className={`badge ${doc.verification_status === 'VERIFIED' ? 'badge-green' : 'badge-red'}`}>
              ✓ {doc.verification_status}
            </span>
          </div>
          <div className="mono" style={{ color: "#60A5FA", fontSize: "0.85rem", wordBreak: "break-all" }}>
            {doc.sha256_hash}
          </div>
        </div>

        {/* Metadata Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", fontSize: "0.825rem", borderTop: "1px solid #E2E8F0", paddingTop: "18px" }}>
          <div>
            <span style={{ color: "#64748B", display: "block" }}>Original Filename</span>
            <strong>{doc.filename}</strong>
          </div>
          <div>
            <span style={{ color: "#64748B", display: "block" }}>File Size</span>
            <strong>{(Number(doc.file_size_bytes || 0) / (1024 * 1024)).toFixed(2)} MB</strong>
          </div>
          <div>
            <span style={{ color: "#64748B", display: "block" }}>MIME Type</span>
            <span className="mono">{doc.mime_type}</span>
          </div>
          <div>
            <span style={{ color: "#64748B", display: "block" }}>Last Verified</span>
            <span>{doc.last_verified_at ? new Date(doc.last_verified_at).toLocaleString() : "Never"}</span>
          </div>
        </div>
      </div>

      {/* Version History Stack */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Document Version Stack</h3>
        {versions.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>Current version: {doc.current_version}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {versions.map((ver, idx) => (
              <div key={idx} style={{ padding: "12px 16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="mono badge badge-blue">{ver.version_number}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{ver.change_description || "Version commit"}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{new Date(ver.created_at).toLocaleString()}</span>
                </div>
                <span className="hash-chip">{ver.sha256_hash.substring(0, 16)}...</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
