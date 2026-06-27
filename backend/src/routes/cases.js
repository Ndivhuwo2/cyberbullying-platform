const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { createCase, getCase, getCases } = require('../controllers/casesController');

//When a POST request comes in, run authenticate first. If the token is valid, next() is called and createCase runs. If the token is invalid, authenticate sends back a 401 and createCase never runs
router.post('/', authenticate, createCase);
router.get('/:id', authenticate, getCase);
router.get('/', authenticate, getCases);

module.exports = router;