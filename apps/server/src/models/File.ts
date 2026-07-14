import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  uploaderId: mongoose.Types.ObjectId;
  url: string;
  publicId: string;
  filename: string;
  format: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', index: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    filename: { type: String, required: true },
    format: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export const File = mongoose.model<IFile>('File', fileSchema);
