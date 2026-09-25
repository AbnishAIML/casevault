import { useState, useEffect } from "react";
import api from "../services/api";
import { Cpu, CheckCircle2, ShieldAlert, RefreshCw, AlertTriangle } from "lucide-react";

export default function IntegrityLedger() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchLedger = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/integrity");
      const data = res.data.data || res.data || [];
      setBlocks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch integrity ledger blocks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const res = await api.post("/integrity/verify");
      setVerificationResult(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError("Ledger verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-900)", marginBottom: "4px" }}>
            Cryptographic Integrity Ledger
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Append-only hash-chain where every audit event is anchored using SHA256(previous_hash + event_data).
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchLedger} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button onClick={handleVerify} disabled={verifying || blocks.length === 0} className="btn btn-primary btn-sm">
            <Cpu size={14} />
            {verifying ? "Verifying Hash Links..." : "Verify Entire Hash Chain"}
          </button>
        </div>
      </div>

      {verificationResult && (
        <div style={{
          padding: "16px 20px",
          borderRadius: "10px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: verificationResult.isValid ? "#ECFDF5" : "#FEF2F2",
          border: `1px solid ${verificationResult.isValid ? "#A7F3D0" : "#FECACA"}`,
          color: verificationResult.isValid ? "#065F46" : "#991B1B"
        }}>
          {verificationResult.isValid ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
          <div>
            <h4 style={{ margin: 0, fontSize: "0.95rem" }}>
              {verificationResult.isValid
                ? `✓ ALL ${verificationResult.totalBlocksChecked} LEDGER BLOCKS MATHEMATICALLY VERIFIED (0 Tampering Detected)`
                : `⚠ INTEGRITY FAILURE: Hash chain link broken at event ${verificationResult.brokenBlockId}!`}
            </h4>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem" }}>
              Algorithm: SHA-256 recursive link verification • Latency: {verificationResult.durationMs}ms
            </p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* Block List / Empty State */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading cryptographic ledger...</div>
      ) : blocks.length === 0 ? (
        <div className="card" style={{ padding: "48px 20px", textAlign: "center" }}>
          <Cpu size={36} color="#94A3B8" style={{ margin: "0 auto 12px auto" }} />
          <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Ledger Has No Blocks Yet</h4>
          <p style={{ fontSize: "0.85rem", color: "#64748B", maxWidth: "460px", margin: "0 auto" }}>
            The integrity ledger records every case registration, document upload, and custody transfer as an immutable cryptographic block.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {blocks.map((block) => (
            <div key={block.id || block.block_number} className="card" style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="mono badge badge-dark">Block #{block.block_number}</span>
                  <span className="mono badge badge-blue">{block.event_id}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{block.event_type}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                  {new Date(block.timestamp).toLocaleString()}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "0.775rem" }}>
                <div>
                  <span style={{ color: "#64748B", display: "block", marginBottom: "2px" }}>Previous Hash Pointer:</span>
                  <div className="mono hash-chip" style={{ width: "100%" }}>{block.previous_hash}</div>
                </div>
                <div>
                  <span style={{ color: "#059669", display: "block", marginBottom: "2px" }}>Current Block Hash:</span>
                  <div className="mono hash-chip" style={{ width: "100%", color: "#059669" }}>{block.current_hash}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
