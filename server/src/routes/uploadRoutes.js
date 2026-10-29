import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `property-${uniqueSuffix}${ext}`);
  }
});

// File Filter (Images only: jpg, jpeg, png, webp, avif)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|avif/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype;

  if (allowedExtensions.test(ext) && (mime.startsWith('image/') || allowedExtensions.test(mime))) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image files (JPEG, JPG, PNG, WEBP, AVIF) are permitted'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit per image
    files: 5 // Maximum 5 files per request
  }
});

const router = express.Router();

// POST /api/upload/multiple (Upload up to 5 images for a property)
router.post('/multiple', (req, res) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: true, message: 'You can only upload a maximum of 5 images per property.' });
      }
      return res.status(400).json({ error: true, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: true, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: true, message: 'No image files provided.' });
    }

    const urls = req.files.map(f => `/uploads/${f.filename}`);
    return res.status(200).json({
      success: true,
      count: urls.length,
      urls
    });
  });
});

export default router;
