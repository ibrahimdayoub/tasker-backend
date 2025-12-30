import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: String,
    color: {
        type: String,
        default: '#ffffff'
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    tags: [String]
}, { timestamps: true });

noteSchema.index({ userId: 1, title: 1 }, { unique: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;