import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path'; // Still needed for path.join

// ONLY keep the route for HTML to PDF generation
import generateHtmlPdfRoute from './routes/generateHtmlPdf.js';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json({ limit: '10mb' })); // To parse JSON request bodies, increased limit for large HTML content
app.use(express.urlencoded({ extended: true })); // For URL-encoded bodies (less common for this use case, but harmless)

// Set UTF-8 for all HTML responses (though for PDF, content-type will change)
app.use((req, res, next) => {
    // This header is more relevant for direct HTML responses.
    // For PDF generation, the generateHtmlPdfRoute will set application/pdf.
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

// View engine setup for EJS (can be removed if EJS is no longer used anywhere in the backend)
// If generateHtmlPdfRoute doesn't rely on EJS or other future routes don't, this can go.
// For now, keeping it in case you have other EJS-based backend functionalities.
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'templates'));

// Routes
// ONLY include the route for HTML to PDF conversion
app.use('/generate/html-pdf', generateHtmlPdfRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});
