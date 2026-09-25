import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield, ShieldCheck, ShieldAlert, Lock, Server, FileCheck, GitBranch,
  Activity, Cpu, ArrowRight, CheckCircle2, ChevronRight, Menu, X,
  FileText, Briefcase, Search, Bell, Users, Eye, Database, ExternalLink
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--slate-50)", display: "flex", flexDirection: "column" }}>
      {/* NAVBAR */}
      <nav style={{
        background: "var(--primary-900)",
        color: "#FFFFFF",
        padding: "16px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-md)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#FFFFFF", textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              padding: "7px 10px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(37,99,235,0.4)"
            }}>
              <Shield size={22} color="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>CASEVAULT</span>
              <span style={{ display: "block", fontSize: "0.65rem", color: "#94A3B8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Legal &amp; Investigation DMS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div style={{ display: "none", alignItems: "center", gap: "28px" }} className="desktop-nav">
            <a href="#features" style={{ color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 500 }}>Features</a>
            <a href="#security" style={{ color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 500 }}>Security</a>
            <a href="#how-it-works" style={{ color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 500 }}>How It Works</a>
            <a href="#lifecycle" style={{ color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 500 }}>Lifecycle</a>
            <a href="#evidence" style={{ color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 500 }}>Evidence</a>
            <a href="#technology" style={{ color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 500 }}>Technology</a>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.2)" }}>
              Login
            </Link>
            <Link to="/dashboard" className="btn btn-accent btn-sm">
              Command Center <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "transparent", border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex" }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div style={{ background: "var(--primary-800)", padding: "16px 24px", marginTop: "12px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: "#FFFFFF" }}>Features</a>
            <a href="#security" onClick={() => setMobileMenuOpen(false)} style={{ color: "#FFFFFF" }}>Security</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: "#FFFFFF" }}>How It Works</a>
            <a href="#lifecycle" onClick={() => setMobileMenuOpen(false)} style={{ color: "#FFFFFF" }}>Lifecycle</a>
            <a href="#technology" onClick={() => setMobileMenuOpen(false)} style={{ color: "#FFFFFF" }}>Technology</a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section style={{
        background: "linear-gradient(135deg, #0B132B 0%, #1C2541 65%, #253252 100%)",
        color: "#FFFFFF",
        padding: "80px 24px 70px 24px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(37,99,235,0.25)", border: "1px solid #3B82F6", padding: "6px 14px", borderRadius: "9999px", marginBottom: "20px" }}>
              <span className="mono" style={{ fontSize: "0.75rem", color: "#93C5FD", fontWeight: 700 }}>
                PROBLEM STATEMENT 26190
              </span>
              <span style={{ fontSize: "0.75rem", color: "#CBD5E1" }}>• Ministry of Home Affairs / NCRB</span>
            </div>

            <h1 style={{ fontSize: "3.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.15, marginBottom: "20px", letterSpacing: "-0.03em" }}>
              Secure Documents.<br />
              Trusted Evidence.<br />
              <span style={{ color: "#60A5FA" }}>Smarter Investigations.</span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "#CBD5E1", lineHeight: 1.6, marginBottom: "32px", maxWidth: "620px" }}>
              CASEVAULT is a secure digital document management platform designed to protect, organize, verify, and audit sensitive legal and investigation records throughout their lifecycle.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/dashboard" className="btn btn-accent btn-lg">
                Access CASEVAULT <ArrowRight size={18} />
              </Link>
              <a href="#security" className="btn btn-secondary btn-lg" style={{ background: "rgba(255,255,255,0.08)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.2)" }}>
                Explore Security Architecture
              </a>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="card" style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "28px",
            borderRadius: "20px",
            color: "#FFFFFF",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={22} color="#10B981" />
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Live Cryptographic Integrity</span>
              </div>
              <span className="badge badge-green pulse-verified">✓ 100% BIT-EXACT</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.825rem" }}>
              <div>
                <span style={{ color: "#94A3B8", display: "block", marginBottom: "2px" }}>Case File Reference:</span>
                <span className="mono" style={{ color: "#60A5FA", fontWeight: 600 }}>CASE-2026-CR-0914-ND</span>
              </div>
              <div>
                <span style={{ color: "#94A3B8", display: "block", marginBottom: "2px" }}>Active Document:</span>
                <span>Certified First Information Report (FIR/042/2026/CYBER)</span>
              </div>
              <div>
                <span style={{ color: "#94A3B8", display: "block", marginBottom: "2px" }}>SHA-256 Hash Digest:</span>
                <div className="mono" style={{ background: "rgba(0,0,0,0.3)", padding: "8px", borderRadius: "6px", color: "#34D399", wordBreak: "break-all", fontSize: "0.75rem" }}>
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" }}>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "8px" }}>
                  <span style={{ color: "#94A3B8", fontSize: "0.7rem", display: "block" }}>RLS ENFORCEMENT</span>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>ACTIVE</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "8px" }}>
                  <span style={{ color: "#94A3B8", fontSize: "0.7rem", display: "block" }}>LEDGER ANCHOR</span>
                  <span style={{ color: "#60A5FA", fontWeight: 700 }}>BLOCK #004</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / SECURITY STRIP */}
      <section style={{ background: "var(--primary-800)", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px 24px", color: "#FFFFFF" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "16px", fontSize: "0.85rem", fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Lock size={16} color="#60A5FA" /> Role-Based Access</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Server size={16} color="#10B981" /> Encrypted Storage</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FileCheck size={16} color="#A78BFA" /> Document Integrity</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Activity size={16} color="#FBBF24" /> Complete Audit Trail</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><GitBranch size={16} color="#F472B6" /> Evidence Tracking</div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section style={{ padding: "80px 24px", background: "var(--slate-100)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>
              Legal Documents Need More Than Storage
            </h2>
            <p style={{ fontSize: "1rem", color: "#64748B", maxWidth: "600px", margin: "0 auto" }}>
              Traditional cloud folders and physical repositories fail modern judicial scrutiny and investigation security standards.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {[
              { title: "Fragmented Systems", desc: "Evidence, police reports, and FIRs scattered across disconnected drives and physical filing cabinets.", icon: Briefcase },
              { title: "Unauthorized Access", desc: "Absence of database-level Row Level Security leaves confidential victim identities exposed to leaks.", icon: Lock },
              { title: "Document Tampering", desc: "Digital files can be silently modified without cryptographic detection, collapsing judicial cases.", icon: ShieldAlert },
              { title: "Missing Version History", desc: "Overwritten files erase previous depositions and statements, destroying procedural auditability.", icon: GitBranch },
              { title: "Weak Auditability", desc: "Inability to demonstrate who viewed, downloaded, or shared an evidentiary file in court proceedings.", icon: Activity },
              { title: "Evidence Tracking Failure", desc: "Physical and digital evidence exhibits change hands without tamper-sealed custody logs.", icon: FileText }
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="card card-hover" style={{ padding: "24px", borderTop: "4px solid #EF4444" }}>
                  <div style={{ background: "#FEF2F2", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                    <Icon size={20} color="#DC2626" />
                  </div>
                  <h4 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>{p.title}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOLUTION & 7-STAGE LIFECYCLE */}
      <section id="lifecycle" style={{ padding: "80px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-blue" style={{ marginBottom: "10px" }}>END-TO-END WORKFLOW</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>
              One Secure Platform for the Entire Document Lifecycle
            </h2>
            <p style={{ fontSize: "1rem", color: "#64748B", maxWidth: "600px", margin: "0 auto" }}>
              From initial field capture to final court presentation, every operation is validated by cryptographic checksums.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px" }}>
            {[
              { step: "01", name: "CAPTURE", desc: "Seize & register digital/physical exhibits" },
              { step: "02", name: "CLASSIFY", desc: "Set confidentiality & sensitivity tier" },
              { step: "03", name: "HASH", desc: "Generate SHA-256 bit-exact digest" },
              { step: "04", name: "STORE", desc: "Save to private encrypted vault" },
              { step: "05", name: "ACCESS", desc: "Enforce strict PostgreSQL RLS" },
              { step: "06", name: "VERIFY", desc: "Recompute checksum on every inspection" },
              { step: "07", name: "ARCHIVE", desc: "Secure permanent judicial custody" }
            ].map((s, idx) => (
              <div key={idx} className="card card-hover" style={{ padding: "20px 14px", textAlign: "center", borderTop: "3px solid #2563EB" }}>
                <span className="mono" style={{ fontSize: "0.8rem", fontWeight: 800, color: "#2563EB" }}>{s.step}</span>
                <h4 style={{ fontSize: "0.95rem", margin: "8px 0 4px 0" }}>{s.name}</h4>
                <p style={{ fontSize: "0.75rem", color: "#64748B" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={{ padding: "80px 24px", background: "var(--slate-50)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>
              Enterprise Features Built for Legal &amp; Investigation Teams
            </h2>
            <p style={{ fontSize: "1rem", color: "#64748B", maxWidth: "600px", margin: "0 auto" }}>
              Engineered to meet the stringent demands of police stations, forensic laboratories, public prosecutors, and judicial registries.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {[
              { title: "Secure Document Vault", desc: "Encrypted file storage with access controls and signed temporary access tokens.", icon: Server },
              { title: "Case Management", desc: "Comprehensive case files tracking FIR numbers, departments, investigating officers, and priority.", icon: Briefcase },
              { title: "Evidence Management", desc: "Physical and digital evidence logging with serial numbers and baseline hashes.", icon: GitBranch },
              { title: "Chain of Custody", desc: "Immutable chronological custodian handoff logging for judicial admissibility.", icon: Activity },
              { title: "Document Versioning", desc: "Linear version stacks (v1.0, v1.1, v2.0) preserving every previous draft and diff.", icon: FileText },
              { title: "SHA-256 Verification", desc: "Real-time bit-exact cryptographic hashing preventing undetected file tampering.", icon: FileCheck },
              { title: "Role-Based Access", desc: "8 granular roles from Super Admin to Judicial Clerk with PostgreSQL RLS.", icon: Users },
              { title: "Secure Sharing", desc: "Time-limited and permission-scoped document sharing with full audit logging.", icon: Lock },
              { title: "Audit Trail", desc: "Non-editable security log capturing actor ID, timestamp, IP address, and operation outcome.", icon: ShieldCheck },
              { title: "Search & Retrieval", desc: "Multi-field search across case titles, FIR numbers, tags, categories, and officers.", icon: Search },
              { title: "Notifications", desc: "Real-time alerts for case assignments, custody transfers, and security events.", icon: Bell },
              { title: "Integrity Ledger", desc: "Tamper-evident hash-chain linking critical audit events cryptographically.", icon: Cpu }
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="card card-hover" style={{ padding: "24px" }}>
                  <div style={{ background: "#EFF6FF", width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                    <Icon size={20} color="#2563EB" />
                  </div>
                  <h4 style={{ fontSize: "1.05rem", marginBottom: "6px" }}>{f.title}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECURITY ARCHITECTURE */}
      <section id="security" style={{ padding: "80px 24px", background: "linear-gradient(135deg, #0B132B 0%, #1C2541 100%)", color: "#FFFFFF" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-blue" style={{ marginBottom: "10px" }}>DEFENSE IN DEPTH</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px", color: "#FFFFFF" }}>
              Security Built Into Every Layer
            </h2>
            <p style={{ fontSize: "1rem", color: "#CBD5E1", maxWidth: "600px", margin: "0 auto" }}>
              A multi-layered defense architecture ensuring that even if one boundary is probed, confidential legal records remain inviolate.
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { layer: "Layer 1: Authentication", desc: "Secure sessions, JWT validation, and multi-factor authorization tokens.", icon: Lock },
              { layer: "Layer 2: Role-Based Authorization", desc: "8 distinct roles governing permissions: case.create, document.verify, evidence.update.", icon: Users },
              { layer: "Layer 3: PostgreSQL Row Level Security (RLS)", desc: "Database-level policy enforcement preventing unauthorized queries even if application code is bypassed.", icon: Database },
              { layer: "Layer 4: Private Storage & Signed URLs", desc: "Files stored in private buckets accessible only via short-lived, permission-verified signed URLs.", icon: Server },
              { layer: "Layer 5: SHA-256 Bit-Level Verification", desc: "Real-time cryptographic hash verification identifying any single modified byte.", icon: FileCheck },
              { layer: "Layer 6: Immutable Audit Trail", desc: "Append-only activity logging capturing IP addresses, timestamps, and actor identities.", icon: Activity },
              { layer: "Layer 7: Cryptographic Integrity Ledger", desc: "Hash-chain connecting case events via SHA256(previous_hash + event_data) for tamper evidence.", icon: Cpu }
            ].map((l, idx) => {
              const Icon = l.icon;
              return (
                <div key={idx} style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px"
                }}>
                  <div style={{ background: "rgba(37, 99, 235, 0.2)", padding: "10px", borderRadius: "8px" }}>
                    <Icon size={20} color="#60A5FA" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1rem", color: "#FFFFFF", marginBottom: "2px" }}>{l.layer}</h4>
                    <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: 0 }}>{l.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "80px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>
              How CASEVAULT Works
            </h2>
            <p style={{ fontSize: "1rem", color: "#64748B", maxWidth: "600px", margin: "0 auto" }}>
              A standardized 7-step procedure followed by investigating officers and judicial clerks.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {[
              { step: 1, title: "Create Case", desc: "Enter FIR Number, title, priority, police station, and assign team officers." },
              { step: 2, title: "Upload Document", desc: "Upload police report, witness statement, or forensic laboratory examination." },
              { step: 3, title: "Generate Integrity Hash", desc: "Calculate SHA-256 hash immediately upon arrival and record in database." },
              { step: 4, title: "Control Access", desc: "Set confidentiality level (Public, Internal, Confidential, Highly Confidential, Restricted)." },
              { step: 5, title: "Track Activity", desc: "Every view, download, and share is immutably logged in the audit trail." },
              { step: 6, title: "Verify Integrity", desc: "Recompute hash against original baseline to confirm zero tampering." },
              { step: 7, title: "Archive Securely", desc: "Preserve case dossier in permanent judicial archive under Section 65B compliance." }
            ].map((s) => (
              <div key={s.step} className="card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{
                    background: "#2563EB",
                    color: "#FFFFFF",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem"
                  }}>
                    {s.step}
                  </span>
                  <h4 style={{ fontSize: "1rem", margin: 0 }}>{s.title}</h4>
                </div>
                <p style={{ fontSize: "0.825rem", color: "#64748B", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)",
        color: "#FFFFFF",
        padding: "60px 24px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px" }}>
            Protect the Evidence. Preserve the Record.
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#DBEAFE", marginBottom: "28px" }}>
            Enter the CASEVAULT command center to manage cases, verify document SHA-256 hashes, and inspect evidence chain of custody.
          </p>
          <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ background: "#0B132B", borderColor: "#0B132B" }}>
            Enter CASEVAULT Command Center <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--primary-900)", color: "#94A3B8", padding: "48px 24px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px", marginBottom: "40px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF", marginBottom: "12px" }}>
                <Shield size={20} color="#60A5FA" />
                <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>CASEVAULT</span>
              </div>
              <p style={{ fontSize: "0.8rem", lineHeight: 1.6, color: "#94A3B8" }}>
                Secure Legal &amp; Investigation Document Management System. Developed for Problem Statement ID 26190 (Ministry of Home Affairs / NCRB Women Safety Division).
              </p>
            </div>

            <div>
              <h5 style={{ color: "#FFFFFF", fontSize: "0.85rem", marginBottom: "12px" }}>Platform Links</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem" }}>
                <Link to="/dashboard" style={{ color: "#94A3B8" }}>Command Center</Link>
                <Link to="/login" style={{ color: "#94A3B8" }}>Officer Login</Link>
                <Link to="/register" style={{ color: "#94A3B8" }}>Register Account</Link>
              </div>
            </div>

            <div>
              <h5 style={{ color: "#FFFFFF", fontSize: "0.85rem", marginBottom: "12px" }}>Security &amp; Technology</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem" }}>
                <span>SHA-256 Binary Hashing</span>
                <span>PostgreSQL Row Level Security</span>
                <span>Cryptographic Integrity Ledger</span>
                <span>Private Signed Storage</span>
              </div>
            </div>

            <div>
              <h5 style={{ color: "#FFFFFF", fontSize: "0.85rem", marginBottom: "12px" }}>Legal &amp; Compliance</h5>
              <p style={{ fontSize: "0.75rem", lineHeight: 1.5, color: "#64748B" }}>
                CASEVAULT is designed as a secure digital document management concept for legal and investigation workflows. Cryptographic SHA-256 verification confirms data integrity and does not, by itself, substitute statutory judicial admissibility.
              </p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", fontSize: "0.75rem" }}>
            <span>© 2026 CASEVAULT. Problem Statement 26190.</span>
            <span>Designed for Law Enforcement, Forensics, and Courts.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
