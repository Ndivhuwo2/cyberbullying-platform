const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { logIncident, getIncidents, deleteIncident } = require('../controllers/incidentsController');

router.post('/', authenticate, logIncident);
router.get('/:id/incidents', authenticate, getIncidents);
router.delete('/:id', authenticate, deleteIncident);

module.exports = router;