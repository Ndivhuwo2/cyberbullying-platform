const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const casesRoutes = require('./routes/cases');
const incidentsRoutes = require('./routes/incidents');
const evidenceRoutes = require('./routes/evidence');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/cases', incidentsRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api', evidenceRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;