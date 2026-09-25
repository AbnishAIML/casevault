const crypto = require("crypto");
const fs = require("fs");

// Computes SHA-256 hash of a file on disk. Used to detect tampering:
// store this hash with each document version, recompute on access,
// and flag a mismatch as potential evidence tampering.
const computeFileHash = (filePath) =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (err) => reject(err));
  });

module.exports = computeFileHash;
