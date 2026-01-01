import express from 'express';
import asyncHandler from 'express-async-handler';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { checkOwnership } from '../middlewares/ownerMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { taskSchema } from '../validators/schemas.js';
import Task from '../models/Task.js';

const router = express.Router();

router.use(ClerkExpressRequireAuth());

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
router.post('/', validate(taskSchema), asyncHandler(async (req, res) => {
  const userId = req.auth.userId;

  const newTask = new Task({
    ...req.body,
    userId: userId
  });

  const savedTask = await newTask.save();

  res.status(201).json({
    message: "Task created successfully",
    data: savedTask
  });
}));

/**
 * @route   GET /api/tasks
 * @desc    Get all user tasks
 */
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  const { isCompleted, priority } = req.query;

  let query = { userId };

  if (isCompleted !== undefined) query.isCompleted = isCompleted === 'true';
  if (priority) query.priority = priority;

  // const tasks = await Task.find(query).sort({ priority: -1, dueDate: 1 });

  let tasks = await Task.find(query).sort({ dueDate: 1 });

  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };

  tasks.sort((a, b) => {
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  res.status(200).json({
    message: "Tasks retrieved successfully",
    data: tasks
  });
}));

/**
 * @route   GET /api/tasks/:id
 * @desc    Get user task
 */
router.get('/:id', checkOwnership(Task), asyncHandler(async (req, res) => {
  const task = req.resource;

  res.status(200).json({
    message: "Task retrieved successfully",
    data: task
  });
}));

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Toggle task status and its subtasks
 */
router.patch('/:id/toggle', checkOwnership(Task), asyncHandler(async (req, res) => {
  const task = req.resource;

  task.isCompleted = !task.isCompleted;

  task.subTasks = task.subTasks.map(sub => ({
    ...sub,
    isDone: task.isCompleted
  }));

  await task.save();

  res.status(200).json({
    message: task.isCompleted ? "Task and all subtasks completed" : "Task status updated",
    data: task
  });
}));

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task permanently
 */
router.delete('/:id', checkOwnership(Task), asyncHandler(async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Task deleted successfully"
  });
}));

/**
 * @route   PATCH /api/tasks/:id/subtasks/:subId/toggle
 * @desc    Toggle a subtask status and parent task
 */
router.patch('/:id/subtasks/:subId/toggle', checkOwnership(Task), asyncHandler(async (req, res) => {
  const task = req.resource;
  const { subId } = req.params;

  const subTask = task.subTasks.id(subId);

  if (!subTask) {
    res.status(404);
    throw new Error("Subtask not found");
  }

  subTask.isDone = !subTask.isDone;

  const allSubTasksDone = task.subTasks.every(sub => sub.isDone);
  task.isCompleted = allSubTasksDone;

  await task.save();

  res.status(200).json({
    message: allSubTasksDone ? "All subtasks and task completed" : "Subtask status updated",
    data: task
  });
}));

export default router;