import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Lock, Eye, EyeOff, AlertTriangle, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: "420px",
        padding: "36px",
        borderRadius: "16px",
        boxShadow: "var(--shadow-xl)"
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            boxShadow: "0 4px 12px rgba(37,99,235,0.4)"
          }}>
            <Shield size={28} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 4px 0" }}>CASEVAULT</h2>
          <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0 }}>
            Secure Officer &amp; Judicial Personnel Sign-In
          </p>
        </div>

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
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>
              Official Email Address *
            </label>
            <input
              type="email"
              placeholder="officer@police.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "0.875rem"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>
              Password *
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.875rem"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748B",
                  padding: "2px"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "11px", marginBottom: "16px" }}
          >
            {loading ? "Authenticating..." : "Sign In to Command Center"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "0.825rem", color: "#64748B", borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
          Need new credentials?{" "}
          <Link to="/register" style={{ fontWeight: 600, color: "#2563EB" }}>
            Register Officer Account
          </Link>
        </div>
      </div>
    </div>
  );
}
