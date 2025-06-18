// server.js
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import generateRoute from './routes/generate.js';

const app = express();

// Middleware
app.use(cors());  // Enable Cross-Origin Requests (CORS)
app.use(bodyParser.json());  // Parse JSON data
app.use(express.urlencoded({ extended: true }));  // Parse form-encoded data

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory for EJS templates
app.set('views', './templates');

// Ensure all responses are sent with UTF-8 encoding (important for multilingual support)
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

// Routes
app.use('/generate', generateRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
