import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CaseList from "./pages/CaseList";
import CaseCreate from "./pages/CaseCreate";
import CaseDetail from "./pages/CaseDetail";
import DocumentList from "./pages/DocumentList";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentDetail from "./pages/DocumentDetail";
import EvidenceList from "./pages/EvidenceList";
import EvidenceDetail from "./pages/EvidenceDetail";
import IntegrityLedger from "./pages/IntegrityLedger";
import AuditTrail from "./pages/AuditTrail";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      {/* Public Landing & Authentication */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Command Center & Operational Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Case Management */}
      <Route
        path="/cases"
        element={
          <ProtectedRoute>
            <AppLayout><CaseList /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/new"
        element={
          <ProtectedRoute>
            <AppLayout><CaseCreate /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:id"
        element={
          <ProtectedRoute>
            <AppLayout><CaseDetail /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Document Vault */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <AppLayout><DocumentList /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/upload"
        element={
          <ProtectedRoute>
            <AppLayout><DocumentUpload /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <AppLayout><DocumentDetail /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Evidence & Chain of Custody */}
      <Route
        path="/evidence"
        element={
          <ProtectedRoute>
            <AppLayout><EvidenceList /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/evidence/:id"
        element={
          <ProtectedRoute>
            <AppLayout><EvidenceDetail /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Cryptographic Ledger & Audit */}
      <Route
        path="/integrity"
        element={
          <ProtectedRoute>
            <AppLayout><IntegrityLedger /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit"
        element={
          <ProtectedRoute>
            <AppLayout><AuditTrail /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AppLayout><Reports /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
