import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, AlertTriangle } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    badgeNumber: "",
    email: "",
    password: "",
    roleId: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const getRoleBadgeConfig = (roleId) => {
    switch (roleId) {
      case "INVESTIGATING_OFFICER":
        return { label: "Police Officer Badge / Service ID *", placeholder: "e.g. POL-882-DEL" };
      case "FORENSIC_OFFICER":
        return { label: "Forensic Examiner / CFSL Lab ID *", placeholder: "e.g. CFSL-DEL-901" };
      case "LEGAL_OFFICER":
        return { label: "Prosecutor / Bar Council Enrollment ID *", placeholder: "e.g. BAR-DL-4482" };
      case "COURT_USER":
        return { label: "Judicial Clerk / Court Staff ID *", placeholder: "e.g. CRT-DIST-102" };
      case "SUPER_ADMIN":
        return { label: "System Administrator ID *", placeholder: "e.g. ADM-ROOT-001" };
      case "VIEWER":
        return { label: "Observer / Auditor ID *", placeholder: "e.g. OBS-AUDIT-01" };
      default:
        return { label: "Official Service / Badge ID *", placeholder: "e.g. ID-12345" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.roleId) {
      setError("Please select your profession / official role first.");
      return;
    }

    if (!form.badgeNumber.trim()) {
      setError("Please enter your official ID / badge number.");
      return;
    }

    setLoading(true);

    try {
      const res = await register(form);
      const successMsg = res?.message || "Account created successfully! Entering Command Center...";
      setSuccess(successMsg);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const badgeConfig = getRoleBadgeConfig(form.roleId);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0B132B 0%, #1C2541 100%)",
      padding: "24px"
    }}>
      <div className="card" style={{
        width: "100%",
        maxWidth: "460px",
        padding: "36px",
        borderRadius: "16px",
        boxShadow: "var(--shadow-xl)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto"
          }}>
            <Shield size={28} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 4px 0" }}>Register Officer</h2>
          <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0 }}>
            CASEVAULT Authorization Provisioning
          </p>
        </div>

        {success && (
          <div style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            padding: "12px 14px",
            borderRadius: "8px",
            marginBottom: "18px",
            fontSize: "0.825rem",
            lineHeight: 1.5
          }}>
            ✓ {success}
          </div>
        )}

        {error && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "18px",
            fontSize: "0.825rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <AlertTriangle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. Full Name */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>
              Full Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Insp. Rajesh K. Varma"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            />
          </div>

          {/* 2. Profession / Assigned Role Selection FIRST */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>
              Assigned Profession / Role *
            </label>
            <select
              value={form.roleId}
              onChange={e => setForm({ ...form, roleId: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: form.roleId ? "1px solid #2563EB" : "1px solid #CBD5E1",
                fontSize: "0.85rem",
                background: form.roleId ? "#F8FAFC" : "#FFFFFF",
                fontWeight: form.roleId ? 600 : 400
              }}
            >
              <option value="">-- Select Profession / Official Role --</option>
              <option value="INVESTIGATING_OFFICER">Investigating Officer (IO) / Police</option>
              <option value="FORENSIC_OFFICER">Forensic Examiner (CFSL)</option>
              <option value="LEGAL_OFFICER">Legal Officer / Prosecutor</option>
              <option value="COURT_USER">Court Clerk / Judicial User</option>
              <option value="SUPER_ADMIN">Super Administrator (Evaluation)</option>
              <option value="VIEWER">Authorized Viewer (Read Only)</option>
            </select>
          </div>

          {/* 3. Official ID / Badge Field ONLY SHOWN AFTER Role is Selected */}
          {form.roleId && (
            <div style={{
              marginBottom: "14px",
              padding: "12px",
              background: "#F1F5F9",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              animation: "fadeIn 0.25s ease-in-out"
            }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px", color: "#1E293B" }}>
                {badgeConfig.label}
              </label>
              <input
                type="text"
                placeholder={badgeConfig.placeholder}
                value={form.badgeNumber}
                onChange={e => setForm({ ...form, badgeNumber: e.target.value })}
                required
                className="mono"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #94A3B8", fontSize: "0.85rem", background: "#FFFFFF" }}
              />
              <span style={{ fontSize: "0.72rem", color: "#64748B", display: "block", marginTop: "4px" }}>
                Government agency credential for authorized role audit.
              </span>
            </div>
          )}

          {/* 4. Email */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>
              Official Email Address *
            </label>
            <input
              type="email"
              placeholder="officer@police.gov.in"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            />
          </div>

          {/* 5. Password */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>
              Password *
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "11px", marginBottom: "16px" }}
          >
            {loading ? "Registering..." : "Create Officer Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "0.825rem", color: "#64748B", borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600, color: "#2563EB" }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
