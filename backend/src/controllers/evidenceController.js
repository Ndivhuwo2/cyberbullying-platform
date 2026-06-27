const prisma = require('../utils/prisma');
const crypto = require('crypto');
const path = require('path');

const uploadEvidence = async (req, res) => {
  try {
    const { case_id } = req.body;

    if (!case_id) {
      return res.status(400).json({ error: 'case_id is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
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

    const sha256Hash = crypto
      .createHash('sha256')
      .update(req.file.buffer)
      .digest('hex');

    const evidence = await prisma.evidence.create({
      data: {
        case_id,
        file_name: req.file.originalname,
        file_type: req.file.mimetype,
        file_url: `/uploads/${req.file.originalname}`,
        sha256_hash: sha256Hash
      }
    });

    res.status(201).json({
      id: evidence.id,
      case_id: evidence.case_id,
      file_name: evidence.file_name,
      file_type: evidence.file_type,
      file_url: evidence.file_url,
      sha256_hash: evidence.sha256_hash,
      uploaded_at: evidence.uploaded_at
    });

  } catch (error) {
    console.log('Error in uploadEvidence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEvidence = async (req, res) => {
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

    const evidence = await prisma.evidence.findMany({
      where: { case_id: id },
      orderBy: { uploaded_at: 'asc' }
    });

    res.status(200).json({ evidence });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { uploadEvidence, getEvidence };