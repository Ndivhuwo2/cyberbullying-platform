const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { logIncident, getIncidents } = require('../controllers/incidentsController');

router.post('/', authenticate, logIncident);
router.get('/:id/incidents', authenticate, getIncidents);

module.exports = router;