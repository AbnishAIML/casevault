// Cloudinary Integration Configuration for CASEVAULT
// Secure Digital Document & Forensic Evidence Storage

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

const isCloudinaryConfigured = () => {
  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    !cloudName.includes("your-") &&
    !apiKey.includes("your-") &&
    !apiSecret.includes("your-")
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  console.log("✓ Live Cloudinary service configured for file uploads.");
} else {
  console.log("ℹ Cloudinary credentials pending in backend/.env. Using secure local disk storage fallback for uploads.");
}

/**
 * Upload a buffer directly to Cloudinary
 * @param {Buffer} buffer File buffer from Multer memoryStorage
 * @param {Object} options Upload options (folder, public_id, resource_type)
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      // Fallback: Save to backend/uploads directory on local disk
      try {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `${options.folder || "vault"}_${Date.now()}_${options.public_id || "file"}.dat`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        return resolve({
          secure_url: `/uploads/${filename}`,
          public_id: filename,
          storage_type: "LOCAL_FALLBACK"
        });
      } catch (err) {
        return reject(err);
      }
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "casevault_documents",
        resource_type: "auto",
        public_id: options.public_id,
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
          storage_type: "CLOUDINARY"
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured()) return true;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary delete notice:", err.message);
    return null;
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary
};
