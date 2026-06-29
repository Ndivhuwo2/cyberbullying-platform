const prisma = require('../utils/prisma');

const logIncident = async (req, res) => {
  try {
    const { case_id, platform, description, occurred_at } = req.body;

    if (!case_id || !platform || !description || !occurred_at) {
      return res.status(400).json({ error: 'case_id, platform, description and occurred_at are required' });
    }

    const foundCase = await prisma.case.findUnique({
      where: { id: case_id }
    });

    if (!foundCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    if (foundCase.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const incident = await prisma.incident.create({
      data: {
        case_id,
        platform,
        description,
        occurred_at: new Date(occurred_at)
      }
    });

    res.status(201).json({
      id: incident.id,
      case_id: incident.case_id,
      platform: incident.platform,
      description: incident.description,
      occurred_at: incident.occurred_at,
      logged_at: incident.logged_at
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getIncidents = async (req, res) => {
  try {
    const { id } = req.params;

    const foundCase = await prisma.case.findUnique({
      where: { id }
    });

    if (!foundCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    if (foundCase.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const incidents = await prisma.incident.findMany({
      where: { case_id: id },
      orderBy: { occurred_at: 'asc' }
    });

    res.status(200).json({ incidents });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await prisma.incident.findUnique({
      where: { id },
      include: { case: true }
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    if (incident.case.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.incident.delete({ where: { id } });

    res.status(200).json({ message: 'Incident deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { logIncident, getIncidents, deleteIncident };