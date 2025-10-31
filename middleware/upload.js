const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper to create folder if it doesn’t exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir = 'uploads/'; // default

    // choose folder based on route or custom field
    if (req.baseUrl.includes('clients')) {
      uploadDir = 'uploads/profile_photos/';
    } else if (req.baseUrl.includes('documents')) {
      uploadDir = 'uploads/documents/';
    } else if (req.baseUrl.includes('receipts')) {
      uploadDir = 'uploads/receipts/';
    }

    ensureDirExists(uploadDir);
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
