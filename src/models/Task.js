import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: String,
  isCompleted: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: Date,
  subTasks: [{
    title: String,
    isDone: { type: Boolean, default: false }
  }]
}, { timestamps: true });

taskSchema.index({ userId: 1, title: 1 }, { unique: true });

const Task = mongoose.model('Task', taskSchema);
export default Task; 