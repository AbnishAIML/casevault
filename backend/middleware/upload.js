// Secure Document and Evidence File Upload Middleware
// Enforces MIME type checks, extension whitelisting, size limits, and filename sanitization

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// In-memory or temporary disk storage
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/tiff",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".txt", ".doc", ".docx"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  // 1. Extension check
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Forbidden file extension '${ext}'. Allowed types: ${allowedExtensions.join(", ")}`), false);
  }

  // 2. MIME type check
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Forbidden MIME type '${file.mimetype}'. Only verified document and forensic image formats are allowed.`), false);
  }

  // 3. Prevent path traversal or shell characters in filename
  file.sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_BYTES || "52428800", 10), // 50MB default
    files: 5
  },
  fileFilter
});

module.exports = upload;
