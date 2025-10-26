// routes/generateDocx.js
import express from 'express';
import htmlToDocx from 'html-to-docx';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    const docxBuffer = await htmlToDocx(html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.docx');
    res.end(docxBuffer);
  } catch (error) {
    console.error('DOCX generation error:', error);
    res.status(500).json({ error: 'Failed to generate DOCX' });
  }
});

export default router;
