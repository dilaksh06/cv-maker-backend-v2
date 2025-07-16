// server.js
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import generateRoute from './routes/generate.js';
import generateDocxRoute from './routes/generateDocx.js';

// ✅ Fix: Use dynamic import for JSX if needed or ensure default export
import generateJsxRoute from './routes/generateJsx.jsx'; // Only if this file uses: `export default router`

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/generate-jsx', generateJsxRoute); // ✅ JSX route must default export a router
app.use('/generate', generateDocxRoute);

// EJS Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'templates'));

// Template List API
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

// UTF-8 middleware
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

// API
app.get('/api/templates', (req, res) => {
  res.json(getTemplateList());
});
app.use('/generate', generateRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
