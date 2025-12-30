import rateLimit from 'express-rate-limit';

const MINUTES = 10;

const apiLimiter = rateLimit({
    windowMs: MINUTES * 60 * 1000,
    max: 100,
    message: {
        message: `Too many requests, Try again after ${MINUTES} minutes`
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default apiLimiter;