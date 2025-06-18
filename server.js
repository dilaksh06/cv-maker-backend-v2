import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import generateRoute from './routes/generate.js';

const app = express();

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());  // Parse JSON
app.use(express.urlencoded({ extended: true }));  // Parse form data

// EJS Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'templates'));  // Absolute path for reliability

// Helper to list EJS templates
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
        return [];  // Return empty array if templates dir doesn't exist
    }
};

// UTF-8 Middleware (for EJS rendering)
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

// Routes
app.get('/api/templates', (req, res) => {
    res.json(getTemplateList());
});
app.use('/generate', generateRoute);

// Error Handling Middleware (catch-all)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});