import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: number;
  status?: 'pending' | 'in progress' | 'completed';
  tags?: string[];
  user: Schema.Types.ObjectId;
  reminderFrequency?: 'daily' | 'weekly' | 'monthly';
  reminderDateTime?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: Number, min: 1, max: 5 },
    status: {
      type: String,
      enum: ['pending', 'in progress', 'completed'],
      default: 'pending',
    },
    tags: {
      type: [String],
      validate: [arrayLimit, 'Exceeded the maximum number of tags (5).'],
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reminderFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'], 
      default: 'daily',
    },
    reminderDateTime: { type: Date },
  },
  { timestamps: true }
);

TaskSchema.index({ title: 'text', description: 'text', tags: 'text' });

function arrayLimit(val: string[] | undefined) {
  return !val || val.length <= 5;
}

export default mongoose.model<ITask>('Task', TaskSchema);
