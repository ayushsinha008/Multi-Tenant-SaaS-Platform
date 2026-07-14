import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string; // e.g., 'created_task', 'updated_project', 'invited_member'
  entityType: string; // e.g., 'Task', 'Project', 'Member', 'Organization'
  entityId: mongoose.Types.ObjectId;
  details?: Record<string, any>;
  ipAddress?: string;
  device?: string;
  browser?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    device: { type: String },
    browser: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
