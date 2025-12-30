import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { checkOwnership } from '../middlewares/ownerMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { noteSchema } from '../validators/schemas.js';
import Note from '../models/Note.js';

const router = express.Router();

router.use(ClerkExpressRequireAuth());

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 */
router.post('/', validate(noteSchema), asyncHandler(async (req, res) => {
  const userId = req.auth.userId;

  const newNote = new Note({
    ...req.body,
    userId: userId
  });

  const savedNote = await newNote.save();

  res.status(201).json({
    message: "Note created successfully",
    data: savedNote
  });
}));

/** * @route   GET /api/notes
 * @desc    Get all user notes with search
 */
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  const { search } = req.query;

  let query = { userId, isArchived: false };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const notes = await Note.find(query).sort({ isPinned: -1, createdAt: -1 });

  res.status(200).json({
    message: "Notes retrieved successfully",
    data: notes
  });
}));

/**
 * @route   GET /api/notes/archived
 * @desc    Get all archived notes for a user
 */
router.get('/archived', asyncHandler(async (req, res) => {
  const userId = req.auth.userId;

  let query = { userId, isArchived: true };

  const archivedNotes = await Note.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    message: "Archived notes retrieved successfully",
    data: archivedNotes
  });
}));

/**
 * @route   PATCH /api/notes/:id/pin
 * @desc    Toggle pin status
 */
router.patch('/:id/pin', checkOwnership(Note), asyncHandler(async (req, res) => {
  const note = req.resource;
  note.isPinned = !note.isPinned;
  await note.save();

  res.status(200).json({
    message: note.isPinned ? "Note pinned" : "Note unpinned",
    data: note
  });
}));

/**
 * @route   PATCH /api/notes/:id/archive
 * @desc    Toggle archive status
 */
router.patch('/:id/archive', checkOwnership(Note), asyncHandler(async (req, res) => {
  const note = req.resource;
  note.isArchived = !note.isArchived;

  const wasPinned = note.isPinned;
  if (note.isArchived) note.isPinned = false;

  await note.save();

  let message = note.isArchived ? "Note archived" : "Note restored";
  if (note.isArchived && wasPinned) message += " and unpinned";

  res.status(200).json({
    message,
    data: note
  });
}));

/**
 * @route   POST /api/notes/:id/duplicate
 * @desc    Clone an existing note
 */
router.post('/:id/duplicate', checkOwnership(Note), asyncHandler(async (req, res) => {
  const original = req.resource;
  const userId = req.auth.userId;

  const baseTitle = original.title.replace(/ \(Copy(?:\s\d+)?\)$/, "");

  const count = await Note.countDocuments({
    userId,
    title: { $regex: new RegExp(`^${baseTitle}( \\(Copy(\\s\\d+)?\\))?$`) }
  });

  let newTitle = (count === 0 || (count === 1 && original.title === baseTitle))
    ? `${baseTitle} (Copy)`
    : `${baseTitle} (Copy ${count})`;

  const duplicate = new Note({
    ...original.toObject(),
    _id: new mongoose.Types.ObjectId(),
    title: newTitle,
    isPinned: false,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  await duplicate.save();

  res.status(201).json({
    data: duplicate,
    message: "Note duplicated successfully",
  });
}));

/**
 * @route   DELETE /api/notes/:id
 * @desc    Permanent delete
 */
router.delete('/:id', checkOwnership(Note), asyncHandler(async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Note deleted successfully"
  });
}));

export default router;