// server.js
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Required for __dirname in ES module
import generateRoute from './routes/generate.js'; // PDF generation route
import generateDocxRoute from './routes/generateDocx.js'; // DOCX generation route

const app = express();

// ✅ Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ✅ EJS setup (for preview/html)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates')); // fix: use __dirname instead of process.cwd()

// Utility function to list EJS templates
const getTemplateList = () => {
    try {
        const files = fs.readdirSync(app.get('views'));
        return files
            .filter(file => file.endsWith('.ejs'))
            .map(file => ({
                id: path.basename(file, '.ejs'),
                name: path.basename(file, '.ejs').replace(/-/g, ' '),
            }));
    } catch (err) {
        console.error("Error reading templates:", err);
        return [];
    }
};

// Optional: Set UTF-8 headers for HTML responses only
app.use((req, res, next) => {
    if (req.accepts('html')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    next();
});

// Routes
app.get('/api/templates', (req, res) => {
    res.json(getTemplateList());
});

app.use('/generate', generateRoute);             // PDF
app.use('/generatedocx', generateDocxRoute);     // DOCX

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});
