import 'dotenv/config';
import express from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import cors from 'cors';
import connectDB from './config/db.js';
import apiLimiter from './config/apiLimiter.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import noteRoutes from './routes/noteRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.set('trust proxy', 1);

// Keep-Alive Route
app.get('/keep-alive', (req, res) => {
    console.log("Keep-alive ping received from cron-job.org at:", new Date().toISOString());
    res.status(200).send('OK');
});

// Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());
app.use('/api', apiLimiter);

// Routes
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);

// Test Route
app.get('/test', (req, res) => {
    const isAuth = req.auth?.userId;

    res.status(200).json({
        status: "Success",
        message: `Server is running smoothly and ${isAuth ? isAuth + " authenticated!" : "not authenticated!"}`,
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port: ${PORT}`);
});