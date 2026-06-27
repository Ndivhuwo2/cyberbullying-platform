const prisma = require('../utils/prisma');

const createCase = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newCase = await prisma.case.create({
      data: {
        title,
        user_id: req.user.id
      }
    });

    res.status(201).json({
      id: newCase.id,
      title: newCase.title,
      status: newCase.status,
      created_at: newCase.created_at
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getCase = async (req, res) => {
  try {
    const { id } = req.params;

    const foundCase = await prisma.case.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            incidents: true,
            evidence: true
          }
        }
      }
    });

    if (!foundCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    if (foundCase.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json({
      id: foundCase.id,
      title: foundCase.title,
      status: foundCase.status,
      created_at: foundCase.created_at,
      incident_count: foundCase._count.incidents,
      evidence_count: foundCase._count.evidence
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCases = async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      where: { user_id: req.user.id },
      include: {
        _count: {
          select: {
            incidents: true,
            evidence: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json({
      cases: cases.map(c => ({
        id: c.id,
        title: c.title,
        status: c.status,
        created_at: c.created_at,
        incident_count: c._count.incidents,
        evidence_count: c._count.evidence
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createCase, getCase, getCases };