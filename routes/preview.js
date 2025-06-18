// In routes/generate.js
import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
    const { templateId, ...cvData } = req.body; // Destructure templateId + CV data
    const templateFile = `${templateId}.ejs`; // e.g., "modern.ejs"

    res.render(templateFile, { data: cvData }, (err, html) => {
        if (err) {
            console.error("EJS render error:", err);
            return res.status(500).send("Template rendering failed");
        }

        // Your existing PDF generation logic here (e.g., using pdfkit or puppeteer)
        // For now, send the HTML for testing:
        res.send(html);
    });
});

export default router;