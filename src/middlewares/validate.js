/**
 * Middleware to generic validation
 * @param {Object} schema - The Joi schema to validate against
 */
export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });

    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');

        return res.status(400).json({
            status: "failed",
            message: cleanMessage
        });
    }
    next();
};