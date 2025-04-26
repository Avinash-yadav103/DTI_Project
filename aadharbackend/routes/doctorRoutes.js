const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { addRecord, getPatients } = require("../controllers/doctorController");

const router = express.Router();

// Make sure temp directory exists
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

// File filter to validate uploads
const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and common medical document types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/dicom'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload a supported file format.`), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

// Route to get patients a doctor has access to
router.get('/access/patients/:uid', getPatients);

// Route to add a medical record (with file upload)
// To this (accept any field name):
router.post('/addrecord/:uid', upload.any(), (req, res, next) => {
    // If any files were uploaded, assign the first one as req.file
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    addRecord(req, res, next);
  });
module.exports = router;