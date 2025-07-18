import ejs from 'ejs'; // Make sure EJS is imported to render templates
import express from 'express';
import { readFileSync } from 'fs'; // For reading JSX HTML content if needed
import htmlToDocx from 'html-to-docx';
import path from 'path'; // Needed to resolve template paths

const router = express.Router();

// Helper function to render JSX HTML (assuming it's already generated and passed as HTML content)
// Or, if JSX templates are compiled to a specific location, you'd load them.
// For now, we assume JSX content is sent directly in the request body.
const getHtmlContentFromRequest = async (req, res, next) => {
    // Determine if the request is for an EJS template or directly provided HTML
    const { templateId, data, htmlContent } = req.body;

    let finalHtmlContent = '';

    if (htmlContent) {
        // If htmlContent is provided (likely from a JSX template rendered on frontend)
        finalHtmlContent = htmlContent;
    } else if (templateId) {
        // If templateId is provided (for EJS templates)
        try {
            // Path to your EJS templates (adjust if 'templates' is not in the project root)
            // You might need to pass `app` instance or base path for `app.get('views')`
            // For simplicity, let's assume `templates` is at the root for now,
            // or modify this to get the path from your `app` instance if this file can access it.
            // A safer way is to pass `app.get('views')` from `app.js` to this route.
            const templatesPath = path.join(process.cwd(), 'templates');
            const templatePath = path.join(templatesPath, `${templateId}.ejs`);

            // Check if template exists
            try {
                readFileSync(templatePath); // Just to check existence sync
            } catch (err) {
                console.error(`EJS template not found: ${templatePath}`, err);
                return res.status(404).send('EJS Template not found.');
            }

            finalHtmlContent = await ejs.renderFile(templatePath, { data: data || {} });

        } catch (error) {
            console.error(`Error rendering EJS template ${templateId}:`, error);
            return res.status(500).send('Failed to render EJS template for DOCX conversion.');
        }
    } else {
        return res.status(400).send('Neither HTML content nor template ID provided for DOCX conversion.');
    }
    
    // Attach the HTML content to the request object for the next middleware/route handler
    req.htmlToConvert = finalHtmlContent;
    next();
};


// POST route for DOCX generation
// The route will be `/generate/docx` based on your `app.use` setup
router.post('/docx', getHtmlContentFromRequest, async (req, res) => {
    const { htmlToConvert } = req; // Get the prepared HTML from the middleware

    if (!htmlToConvert) {
        return res.status(500).send('No HTML content available for DOCX conversion.');
    }

    try {
        // html-to-docx options
        const docxOptions = {
            orientation: 'portrait',
            margins: { top: 720, right: 720, bottom: 720, left: 720 }, // Default: 0.5 inch in twips
            // Add header/footer HTML if needed, e.g.:
            // header: '<h1>My CV</h1>',
            // footer: '<p>Page <span class="pageNumber"></span> of <span class="totalPages"></span></p>',
            // For complex CSS, you might need to simplify it or pass it within the HTML itself.
            // Consider what elements are supported well by html-to-docx (basic formatting, lists, tables).
        };

        const fileBuffer = await htmlToDocx(htmlToConvert, null, docxOptions);

        res.setHeader('Content-Disposition', 'attachment; filename=your_cv.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(fileBuffer);

    } catch (error) {
        console.error('Error converting HTML to DOCX:', error);
        res.status(500).send('Failed to convert HTML to DOCX.');
    }
});

export default router;