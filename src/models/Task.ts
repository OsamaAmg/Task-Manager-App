import mongoose, { Schema, models, Document } from "mongoose";

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: { 
      type: String, 
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    status: { 
      type: String, 
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: { 
      type: Date 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { 
    timestamps: true 
  }
);

// Add indexes for better performance
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

const Task = models.Task || mongoose.model<ITask>("Task", taskSchema);
export default Task;