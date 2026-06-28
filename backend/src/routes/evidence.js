const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authenticate');
const { uploadEvidence, getEvidence } = require('../controllers/evidenceController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', authenticate, upload.single('file'), uploadEvidence);
router.get('/cases/:id/evidence', authenticate, getEvidence);

module.exports = router;