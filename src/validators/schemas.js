import Joi from 'joi';

export const noteSchema = Joi.object({
    // title: Joi.string().min(1).max(255).trim().required(),
    title: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required()
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title should be at least {#limit} characters long',
            'any.required': 'Title is a required field'
        }),
    content: Joi.string().allow(''),
    color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default('#ffffff'),
    tags: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one tag is required'
        }),
    isPinned: Joi.boolean()
});

export const taskSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required()
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title should be at least {#limit} characters long',
            'any.required': 'Title is a required field'
        }),
    content: Joi.string().allow(''),
    isCompleted: Joi.boolean().default(false),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
    dueDate: Joi.date().iso().allow(null),
    subTasks: Joi.array().items(Joi.object({
        title: Joi.string().required(),
        isDone: Joi.boolean().default(false)
    })).min(1).required().messages({
        'array.min': 'At least one sub-task is required'
    })
});