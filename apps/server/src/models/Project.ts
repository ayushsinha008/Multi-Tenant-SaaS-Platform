import mongoose, { Document, Schema } from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

export interface IProject extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  tags: string[];
  members: mongoose.Types.ObjectId[]; // User references
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.ACTIVE },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    tags: [{ type: String }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
