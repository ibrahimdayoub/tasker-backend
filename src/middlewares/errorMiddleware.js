export const notFound = (req, res, next) => {
    res.status(404);
    next(new Error(`Route Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
    if (err.status === 401 || err.message?.includes('Clerk')) {
        res.status(401);
        return res.json({
            message: "Authentication failed: Please login again",
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }

    if (err.code === 11000) {
        res.status(400);
        const fields = Object.keys(err.keyValue);
        const actualField = fields.find(f => f !== 'userId') || fields[0];
        err.message = `The ${actualField} is already used`;
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};