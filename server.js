import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';

import generateRoute from './routes/generate.js';
import generateDocxRoute from './routes/generateDocx.js';
import generateHtmlPdfRoute from './routes/generateHtmlPdf.js';
import generateJsxRoute from './routes/generateJsx.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// UTF-8 for all HTML responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

// View engine setup for EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'templates'));

// 🔁 Template listing: EJS + JSX templates
const getTemplateList = () => {
  const templates = [];

  // EJS Templates
  try {
    const files = fs.readdirSync(app.get('views'));
    files
      .filter(file => file.endsWith('.ejs'))
      .forEach(file => {
        templates.push({
          id: path.basename(file, '.ejs'),
          name: path.basename(file, '.ejs').replace(/-/g, ' '),
          type: 'ejs',
        });
      });
  } catch (err) {
    console.error("Error reading EJS templates:", err);
  }

  // JSX Templates (Manually listed for now)
  const jsxTemplates = [
    {
      id: 'template-jsx-modern-elegant',
      name: 'Modern Elegant',
      type: 'jsx',
    },
    {
      id: 'template-jsx-clean-white',
      name: 'Clean White',
      type: 'jsx',
    },
  ];

  return [...templates, ...jsxTemplates];
};

// Routes
app.get('/api/templates', (req, res) => {
  res.json(getTemplateList());
});

app.use('/generate', generateRoute); // EJS → PDF
app.use('/generate', generateDocxRoute); // EJS → DOCX
app.use('/generate/html-pdf', generateHtmlPdfRoute); // JSX → HTML → PDF
app.use('/generate-jsx', generateJsxRoute); // JSX → HTML

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
