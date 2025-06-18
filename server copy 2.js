import bodyParser from 'body-parser';
import express from 'express';
import generateRoute from './routes/generate.js';

const app = express();

// CORS config
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://dpk-resumi.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middlewares
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Timeout middleware for Vercel
app.use((req, res, next) => {
    req.setTimeout(8000);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('✅ PDF Generation API is operational');
});
app.use('/generate', generateRoute);

// Export for Vercel
export default app;
