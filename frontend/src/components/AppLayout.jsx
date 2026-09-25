import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield, LayoutDashboard, Briefcase, FileText, GitBranch, Search,
  Bell, Activity, Cpu, BarChart3, Settings, LogOut, Menu, X, User,
  CheckCircle2, AlertTriangle, ShieldCheck
} from "lucide-react";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Cases", path: "/cases", icon: Briefcase },
    { label: "Documents", path: "/documents", icon: FileText },
    { label: "Evidence", path: "/evidence", icon: GitBranch },
    { label: "Integrity Ledger", path: "/integrity", icon: Cpu },
    { label: "Audit Trail", path: "/audit", icon: Activity },
    { label: "Reports", path: "/reports", icon: BarChart3 }
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case "SUPER_ADMIN": return "badge-dark";
      case "INVESTIGATING_OFFICER": return "badge-blue";
      case "FORENSIC_OFFICER": return "badge-amber";
      case "LEGAL_OFFICER": return "badge-blue";
      case "COURT_USER": return "badge-green";
      default: return "badge-slate";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--slate-50)" }}>
      {/* SIDEBAR (Desktop) */}
      <aside style={{
        width: "260px",
        background: "var(--primary-900)",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        boxShadow: "var(--shadow-md)",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 50
      }} className="desktop-sidebar">
        {/* Brand */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#FFFFFF", textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              padding: "7px 10px",
              borderRadius: "10px",
              display: "flex"
            }}>
              <Shield size={20} color="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>CASEVAULT</span>
              <span style={{ display: "block", fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>
                Command Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: "20px 14px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  color: isActive ? "#FFFFFF" : "#94A3B8",
                  background: isActive ? "#2563EB" : "transparent",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "all var(--transition-fast)"
                }}
              >
                <Icon size={18} color={isActive ? "#FFFFFF" : "#94A3B8"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card at Bottom of Sidebar */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#3B82F6",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.85rem"
            }}>
              {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : "OF"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {user?.fullName || "Officer in Charge"}
              </div>
              <span className={`badge ${getRoleBadge(user?.role)}`} style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                {user?.role || "OFFICER"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.06)",
              color: "#EF4444",
              border: "1px solid rgba(239,68,68,0.2)",
              padding: "6px",
              borderRadius: "6px",
              fontSize: "0.775rem",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "6px"
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* TOPBAR */}
        <header style={{
          background: "#FFFFFF",
          borderBottom: "1px solid var(--slate-200)",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-900)" }}>
              NCRB / Women Safety Division
            </span>
            <span className="badge badge-slate" style={{ fontSize: "0.7rem" }}>
              PS ID: 26190
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "4px 10px", borderRadius: "9999px", fontWeight: 600 }}>
              <ShieldCheck size={14} /> SHA-256 Verified
            </div>
            <Link to="/" style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500, textDecoration: "none" }}>
              Public Portal
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, padding: "28px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
