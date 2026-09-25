import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--slate-50)",
        color: "var(--primary-900)"
      }}>
        <div className="spin" style={{
          width: "36px",
          height: "36px",
          border: "3px solid #E2E8F0",
          borderTopColor: "#2563EB",
          borderRadius: "50%",
          marginBottom: "16px"
        }} />
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748B" }}>
          Authenticating secure session...
        </span>
      </div>
    );
  }

  const token = localStorage.getItem("sdms_token");
  if (!user && (!token || token === "null" || token === "undefined")) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
