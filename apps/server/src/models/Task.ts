import mongoose, { Document, Schema } from 'mongoose';

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  DONE = 'Done',
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export interface ITask extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  dueDate?: Date;
  assignees: mongoose.Types.ObjectId[]; // User references
  attachments: mongoose.Types.ObjectId[]; // File references
  position: number; // For Kanban drag & drop ordering
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO },
    priority: { type: String, enum: Object.values(TaskPriority), default: TaskPriority.MEDIUM },
    labels: [{ type: String }],
    dueDate: { type: Date },
    assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attachments: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);
