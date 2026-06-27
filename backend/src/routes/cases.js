const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { createCase, getCase, getCases } = require('../controllers/casesController');

router.get('/', authenticate, getCases);
router.post('/', authenticate, createCase);
router.get('/:id', authenticate, getCase);

module.exports = router;