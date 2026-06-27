const prisma = require('../utils/prisma');
const PDFDocument = require('pdfkit');

const generateReport = async (req, res) => {
  try {
    const { id } = req.params;

    const foundCase = await prisma.case.findUnique({
      where: { id },
      include: {
        incidents: {
          orderBy: { occurred_at: 'asc' }
        },
        evidence: {
          orderBy: { uploaded_at: 'asc' }
        }
      }
    });

    if (!foundCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    if (foundCase.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="case-report-${id}.pdf"`
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Cyberbullying Incident Report', { align: 'center' });

    doc.moveDown();
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Generated: ${new Date().toISOString()}`, { align: 'center' });

    doc.moveDown(2);

    // Case details
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Case Details');

    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Case ID: ${foundCase.id}`)
      .text(`Title: ${foundCase.title}`)
      .text(`Status: ${foundCase.status}`)
      .text(`Created: ${foundCase.created_at.toISOString()}`);

    doc.moveDown(2);

    // Incidents
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Incidents');

    doc.moveDown(0.5);

    if (foundCase.incidents.length === 0) {
      doc.fontSize(12).font('Helvetica').text('No incidents logged.');
    } else {
      foundCase.incidents.forEach((incident, index) => {
        doc
          .fontSize(13)
          .font('Helvetica-Bold')
          .text(`Incident ${index + 1}`);

        doc
          .fontSize(12)
          .font('Helvetica')
          .text(`Platform: ${incident.platform}`)
          .text(`Occurred: ${incident.occurred_at.toISOString()}`)
          .text(`Logged: ${incident.logged_at.toISOString()}`)
          .text(`Description: ${incident.description}`);

        doc.moveDown();
      });
    }

    doc.moveDown();

    // Evidence
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Evidence');

    doc.moveDown(0.5);

    if (foundCase.evidence.length === 0) {
      doc.fontSize(12).font('Helvetica').text('No evidence uploaded.');
    } else {
      foundCase.evidence.forEach((item, index) => {
        doc
          .fontSize(13)
          .font('Helvetica-Bold')
          .text(`Evidence ${index + 1}`);

        doc
          .fontSize(12)
          .font('Helvetica')
          .text(`File: ${item.file_name}`)
          .text(`Type: ${item.file_type}`)
          .text(`Uploaded: ${item.uploaded_at.toISOString()}`)
          .text(`SHA256: ${item.sha256_hash}`);

        doc.moveDown();
      });
    }

    doc.end();

  } catch (error) {
    console.log('Error in generateReport:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { generateReport };