const prisma = require('../utils/prisma');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

function toSAST(date) {
  return new Date(date).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' });
}

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
      .text(`Generated: ${toSAST(new Date())}`, { align: 'center' });
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
      .text(`Created: ${toSAST(foundCase.created_at)}`);
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
          .text(`Occurred: ${toSAST(incident.occurred_at)}`)
          .text(`Logged: ${toSAST(incident.logged_at)}`)
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
      for (const [index, item] of foundCase.evidence.entries()) {
        doc
          .fontSize(13)
          .font('Helvetica-Bold')
          .text(`Evidence ${index + 1}`);
        doc
          .fontSize(12)
          .font('Helvetica')
          .text(`File: ${item.file_name}`)
          .text(`Type: ${item.file_type}`)
          .text(`Uploaded: ${toSAST(item.uploaded_at)}`)
          .text(`SHA256: ${item.sha256_hash}`);
        doc.moveDown(0.5);

        const isImage = item.file_type.startsWith('image/');
        if (isImage) {
          const filePath = path.join(__dirname, '../../uploads', path.basename(item.file_url));
          if (fs.existsSync(filePath)) {
            doc.image(filePath, {
              fit: [450, 300],
              align: 'center'
            });
            doc.moveDown();
          } else {
            doc
              .fontSize(11)
              .font('Helvetica')
              .fillColor('red')
              .text('Image file not found on server.')
              .fillColor('black');
            doc.moveDown();
          }
        }
        doc.moveDown();
      }
    }

    doc.end();

  } catch (error) {
    console.log('Error in generateReport:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { generateReport };