const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { createCase, getCase, getCases, updateCaseStatus, deleteCase, updateCaseTitle } = require('../controllers/casesController');

router.get('/', authenticate, getCases);
router.post('/', authenticate, createCase);
router.get('/:id', authenticate, getCase);
router.patch('/:id/status', authenticate, updateCaseStatus);
router.patch('/:id/title', authenticate, updateCaseTitle);
router.delete('/:id', authenticate, deleteCase);

module.exports = router;