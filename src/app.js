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
    res.status(200).json({
        status: "Success",
        message: "Server is running smoothly",
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Test Auth
app.get('/api/test', (req, res) => {
    if (req.auth?.userId) {
        res.status(200).json({
            message: "Authenticated",
            userId: req.auth.userId
        });
    } else {
        res.status(401).json({
            message: "Not Authenticated"
        });
    }
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port: ${PORT}`);
});