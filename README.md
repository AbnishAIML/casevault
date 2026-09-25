<div align="center">

# 🛡️ CaseVault

### Secure Digital Document & Forensic Evidence Management System

**Secure Documents. Trusted Evidence. Smarter Investigations.**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Local-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-Government%20Use-blue?style=flat-square)](#license)
[![SIH](https://img.shields.io/badge/SIH-Problem%20Statement%2026190-orange?style=flat-square)](#)

**Problem Statement:** #26190 — Secure Digital Document Management System for Legal and Investigation Documents<br>
**Organization:** Ministry of Home Affairs (MHA) · **Department:** National Crime Records Bureau (NCRB), Women Safety Division<br>
**Theme:** Blockchain & Cybersecurity

</div>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Role-Based Access Control](#role-based-access-control-rbac)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Security & Legal Compliance](#security--legal-compliance)
- [License](#license)

---

<a id="overview"></a>
## 🔎 Overview

**CaseVault** is an enterprise-grade digital document and forensic evidence management platform built for law enforcement agencies, cybercrime investigative cells, forensic laboratories, public prosecutors, and judicial courts.

It addresses critical vulnerabilities in judicial records management:

| Problem | CaseVault's Solution |
|---|---|
| 🔐 **Tampering & Spoliation** — Traditional file shares and paper records lack continuous cryptographic integrity validation | Computes binary **SHA-256** hashes of every file and anchors them in an **immutable cryptographic hash chain** |
| 🔗 **Broken Chain of Custody** — Physical exhibits and digital forensic media suffer unverifiable handoffs | Records every transfer step with timestamping, custodian identities, and transfer reason |
| 👥 **Unverified Access & Leakage** — Uncontrolled document access across investigative teams | Enforces fine-grained **Role-Based Access Control (RBAC)** across six official roles |
| ⚖️ **Statutory Auditability** — Records must withstand legal scrutiny in court | Automatically logs every login, verification, view, and blocked attempt in an immutable audit trail conforming to **Section 65B of the Indian Evidence Act** |

---

<a id="key-features"></a>
## ✨ Key Features

- 🔒 **Cryptographic Integrity Ledger** — Append-only SHA-256 hash chain, mathematically verifiable end-to-end
- 📁 **Secure Document Vault** — Cloudinary-backed encrypted storage with bit-exact tamper verification
- 🧾 **Chain of Custody Tracking** — Full custody trail for physical exhibits and digital forensic media
- 🛡️ **Six-Tier RBAC** — Purpose-built roles for officers, forensic examiners, prosecutors, courts, and admins
- 📊 **Executive Reporting** — Real-time aggregates and CSV export for case, document, and ledger statistics
- 📜 **Immutable Audit Trail** — Every system action logged for legal admissibility

---

<a id="system-architecture"></a>
## 🏗️ System Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   CLIENT LAYER                        │
                    │         React 18 + Vite + Lucide + Modern CSS          │
                    └───────────────────────────┬────────────────────────────┘
                                                 │
                                     REST APIs / Proxy (/api)
                                                 │
                                                 ▼
                    ┌────────────────────────────────────────────────────────┐
                    │                   BACKEND LAYER                        │
                    │   Node.js + Express.js API Server (Port 5000)          │
                    │   • Helmet Security Headers & API Rate Limiting        │
                    │   • JWT Authentication & RBAC Role Guards              │
                    │   • Multer File Validation (MIME & Extension Guards)   │
                    │   • SHA-256 Cryptographic Engine & Hash-Chain Ledger   │
                    │   • Forensic Audit Trail Engine                        │
                    └───────────────┬────────────────────────┬───────────────┘
                                    │                         │
                        Mongoose Connection         Cloudinary SDK / Stream
                                    │                         │
                                    ▼                         ▼
                    ┌────────────────────────┐   ┌───────────────────────────┐
                    │     MONGODB DATABASE   │   │     CLOUDINARY STORAGE    │
                    │  • Users & Profiles    │   │  • Legal Documents Vault  │
                    │  • Case Dossiers & FIR │   │  • Forensic Evidence Files│
                    │  • Document Records    │   │  • Exhibit Photos & Dumps │
                    │  • Chain of Custody    │   │  • Secure CDN Delivery    │
                    │  • Integrity Ledger    │   └───────────────────────────┘
                    │  • Immutable Audit Log │
                    └────────────────────────┘
```

---

<a id="technology-stack"></a>
## 🧰 Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express.js, Mongoose (MongoDB ODM), Cloudinary SDK, Multer, Helmet, CORS, Express Rate Limit, JSON Web Tokens (JWT), BcryptJS |
| **Frontend** | React 18, Vite, React Router 7, Lucide React, Custom Dark/Glassmorphic Design System |
| **Database** | MongoDB (Local or MongoDB Atlas) — normalized collections, snake_case JSON serialization |
| **Storage** | Cloudinary cloud storage for encrypted document and forensic exhibit delivery |
| **Security & Cryptography** | SHA-256 binary file hashing (256-bit fingerprint) · Append-only hash-chain ledger · Bcrypt password hashing (10 salt rounds) |

**Hash-chain formula:**

```
Current Hash = SHA256(previous_hash + event_type + entity_id + timestamp + data)
```

---

<a id="folder-structure"></a>
## 📂 Folder Structure

<details>
<summary><strong>Click to expand full project structure</strong></summary>

```
secure-document-management-system/
├── backend/
│   ├── config/
│   │   ├── db.js                   # Mongoose MongoDB connection & health check
│   │   └── cloudinary.js           # Cloudinary configuration & upload stream helpers
│   ├── controllers/
│   │   ├── authController.js       # Officer registration, login, profile, audit logging
│   │   ├── caseController.js       # Case dossiers, FIR tracking, ledger anchoring
│   │   ├── documentController.js   # Cloudinary storage, SHA-256 hashing, verification
│   │   ├── evidenceController.js   # Forensic exhibits, chain of custody
│   │   ├── integrityController.js  # Cryptographic hash-chain query & verification
│   │   ├── auditController.js      # Immutable system audit trail queries
│   │   └── reportController.js     # Statistical reporting & aggregates
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification and RBAC role guards
│   │   └── upload.js               # Multer memory storage & MIME whitelist guards
│   ├── models/
│   │   ├── User.js                 # User credentials, bcrypt hash, RBAC roles
│   │   ├── Case.js                 # Legal cases, FIR numbers, status, members
│   │   ├── Document.js             # Vault documents, Cloudinary paths, SHA-256 hashes
│   │   ├── Evidence.js             # Forensic exhibits, custody logs, baseline hashes
│   │   ├── IntegrityBlock.js       # Immutable SHA-256 hash-chain blocks
│   │   └── AuditLog.js             # System-wide forensic activity trail
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── caseRoutes.js           # /api/cases
│   │   ├── documentRoutes.js       # /api/documents
│   │   ├── evidenceRoutes.js       # /api/evidence
│   │   ├── integrityRoutes.js      # /api/integrity
│   │   ├── auditRoutes.js          # /api/audit
│   │   └── reportRoutes.js         # /api/reports
│   ├── utils/
│   │   ├── crypto.js               # SHA-256 hash calculation & hash-chain verification
│   │   └── response.js             # Standardized API response formatters
│   ├── .env                        # Local environment secrets (ignored by git)
│   ├── .env.example                # Documented backend environment template
│   ├── package.json
│   └── server.js                   # Express application entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global JWT authentication state & officer profile
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Public NCRB / MHA portal landing
│   │   │   ├── Login.jsx           # Secure officer authentication
│   │   │   ├── Register.jsx        # Role-first registration with badge verification
│   │   │   ├── Dashboard.jsx       # Command Center overview and real-time metrics
│   │   │   ├── CaseList.jsx        # Case files directory with filters
│   │   │   ├── CaseDetail.jsx      # Dossier overview, documents, and exhibits
│   │   │   ├── CaseCreate.jsx      # FIR and case registration form
│   │   │   ├── DocumentList.jsx    # Secure Document Vault directory
│   │   │   ├── DocumentDetail.jsx  # SHA-256 bit-level tamper verification inspector
│   │   │   ├── DocumentUpload.jsx  # Multi-tier document upload & hash calculation
│   │   │   ├── EvidenceList.jsx    # Forensic evidence locker
│   │   │   ├── EvidenceDetail.jsx  # Physical & digital chain of custody tracker
│   │   │   ├── IntegrityLedger.jsx # Append-only cryptographic hash-chain ledger
│   │   │   ├── AuditTrail.jsx      # Immutable system activity logs
│   │   │   └── Reports.jsx         # Executive analytics and CSV report export
│   │   ├── services/
│   │   │   └── api.js              # Axios HTTP client with Bearer token interceptor
│   │   ├── App.jsx                 # Route definitions and ProtectedRoute guards
│   │   ├── index.css               # Design system tokens and styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

</details>

---

<a id="role-based-access-control-rbac"></a>
## 🔑 Role-Based Access Control (RBAC)

CaseVault provides six distinct role tiers:

| Role Identifier | Role Name | Primary Responsibilities |
|---|---|---|
| `INVESTIGATING_OFFICER` | Investigating Officer (IO) / Police | Register FIRs, upload investigation files, seize exhibits, update case status |
| `FORENSIC_OFFICER` | Forensic Examiner (CFSL) | Analyze digital exhibits, upload forensic lab reports, verify hashes |
| `LEGAL_OFFICER` | Public Prosecutor / Legal Officer | Inspect case dossiers, review witness statements, inspect audit trails |
| `COURT_USER` | Judicial Clerk / Court User | Access charge sheets, verify case filings, check exhibit seals |
| `SUPER_ADMIN` | System Administrator | Manage system configuration, monitor audit logs, maintain system health |
| `VIEWER` | Authorized Observer | Read-only inspection of permitted public/internal documents |

---

<a id="getting-started"></a>
## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — running locally on port `27017`, or a MongoDB Atlas connection URI
- **Cloudinary Account** — free tier available at [cloudinary.com](https://cloudinary.com)

### 1. Clone the repository

```bash
git clone https://github.com/AbnishAIML/casevault.git
cd casevault
```

### 2. Start the backend API server

```bash
cd backend
npm install
npm run dev
```

The server starts on `http://localhost:5000` and automatically connects to MongoDB and Cloudinary.

### 3. Start the frontend client

```bash
cd frontend
npm install
npm run dev
```

The application opens on `http://localhost:5173`.

---

<a id="environment-configuration"></a>
## ⚙️ Environment Configuration

Create a `backend/.env` file using `backend/.env.example` as a template:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (Local MongoDB or MongoDB Atlas)
MONGO_URI=mongodb://127.0.0.1:27017/casevault

# Cloudinary Configuration for Secure File Uploads
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT Authentication Security Secret
JWT_SECRET=your_jwt_secret_min_32_characters
JWT_EXPIRES_IN=1d

# Upload Security Limits
MAX_FILE_SIZE_BYTES=52428800
ALLOWED_MIME_TYPES=application/pdf,image/png,image/jpeg,image/tiff,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

> ⚠️ **Never commit `.env` to version control.** Keep secrets isolated to the backend runtime.

---

<a id="api-reference"></a>
## 📡 API Reference

### Authentication `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new officer account |
| `POST` | `/api/auth/login` | Authenticate with email and password to receive JWT |
| `GET` | `/api/auth/me` | Retrieve authenticated officer profile |
| `POST` | `/api/auth/logout` | Revoke session and record audit event |

### Case Dossiers `/api/cases`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cases` | Retrieve cases with optional search, status, and priority filters |
| `POST` | `/api/cases` | Register a new case dossier (anchored in cryptographic ledger) |
| `GET` | `/api/cases/:id` | Get case details, associated documents, and evidence items |
| `PUT` | `/api/cases/:id` | Update case information or status |
| `PUT` | `/api/cases/:id/archive` | Archive a case file |

### Document Vault `/api/documents`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/documents` | Search and filter vault documents |
| `POST` | `/api/documents` | Upload document, calculate SHA-256 hash, anchor in ledger |
| `GET` | `/api/documents/:id` | Retrieve document details and Cloudinary download link |
| `POST` | `/api/documents/:id/verify` | Execute live SHA-256 bit-exact tamper verification against the ledger |
| `POST` | `/api/documents/:id/versions` | Upload an updated document version and chain it to history |

### Evidence Locker & Custody `/api/evidence`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/evidence` | List forensic exhibits and seized digital media |
| `POST` | `/api/evidence` | Log new physical exhibit or digital seizure |
| `GET` | `/api/evidence/:id` | Retrieve evidence profile and full chain of custody log |
| `POST` | `/api/evidence/:id/custody` | Transfer custody to another officer/lab (anchored in ledger) |

### Cryptographic Ledger `/api/integrity`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/integrity` | Retrieve all chronological cryptographic ledger blocks |
| `POST` | `/api/integrity/verify` | Perform recursive link verification across the entire hash chain |

### System Audit Trail `/api/audit`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/audit` | Retrieve immutable system audit events, filterable by action, entity, and result |

### Reports & Analytics `/api/reports`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports/stats` | Get real-time aggregates (total cases, verified documents, storage used, ledger blocks) |

---

<a id="security--legal-compliance"></a>
## 🔐 Security & Legal Compliance

1. **Tamper Prevention** — Every file undergoes binary SHA-256 hashing. Modifying a single bit changes the hash completely, causing instant verification failure.
2. **Hash-Chain Immutability** — Each block references the SHA-256 hash of the previous block, forming a tamper-evident blockchain-like structure.
3. **Chain of Custody Integrity** — Evidentiary transfers cannot be erased or retroactively modified, meeting legal standards under **Section 65B of the Indian Evidence Act**.
4. **Environment Isolation** — Secrets and API keys are stored exclusively on the server in `backend/.env` and are never exposed to the frontend.

---

<a id="license"></a>
## 📄 License

Developed under the **National Crime Records Bureau (NCRB)** & **Ministry of Home Affairs (MHA)** — Problem Statement 26190 guidelines, for evaluation and official government deployment purposes.

---

<div align="center">

**Repository:** [github.com/AbnishAIML/casevault](https://github.com/AbnishAIML/casevault)

</div>
