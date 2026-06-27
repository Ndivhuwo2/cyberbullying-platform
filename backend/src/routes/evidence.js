const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../middleware/authenticate');
const { uploadEvidence, getEvidence } = require('../controllers/evidenceController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', authenticate, upload.single('file'), uploadEvidence);
router.get('/cases/:id/evidence', authenticate, getEvidence);

module.exports = router;