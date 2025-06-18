// server.js
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import generateRoute from './routes/generate.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './templates');

// Ensure all responses are sent with UTF-8 encoding
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

// Default route to confirm the API is working
app.get('/', (req, res) => {
    res.send('✅ API is working (Vercel & Local)');
});

// Routes
app.use('/generate', generateRoute);

// Only listen when NOT in serverless (Vercel) environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running locally at http://localhost:${PORT}`);
    });
}

// Export the app for serverless environments (Vercel)
export default app;
