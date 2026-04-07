import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import cors from 'cors';
import connectDB from './config/db.js';
import apiLimiter from './config/apiLimiter.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import noteRoutes from './routes/noteRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.set('trust proxy', 1);

// Keep-Alive (cron-job.org)
app.get('/keep-alive', async (req, res) => {
    const timestamp = new Date().toISOString();
    try {
        // Check Mongoose connection state (0 = disconnected, 1 = connected)
        const isConnected = mongoose.connection.readyState === 1;

        if (isConnected) {
            // Perform a "Ping" command to MongoDB to ensure the session is active
            await mongoose.connection.db.admin().ping();
        }

        console.log(`[${timestamp}] Keep-alive ping received. DB Status: ${isConnected ? 'Active' : 'Disconnected'}`);

        res.status(200).json({
            status: 'OK',
            database: isConnected ? 'Connected' : 'Disconnected',
            timestamp: timestamp
        });
    } catch (error) {
        console.error(`[${timestamp}] Keep-alive Error:`, error.message);
        res.status(500).json({ status: 'Error', message: error.message });
    }
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

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port: ${PORT}`);
});