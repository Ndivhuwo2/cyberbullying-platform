const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { generateReport } = require('../controllers/reportController');

router.get('/:id/report', authenticate, generateReport);

module.exports = router;