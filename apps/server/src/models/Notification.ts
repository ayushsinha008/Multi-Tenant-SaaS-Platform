import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
  PROJECT_INVITE = 'Project Invite',
  TASK_ASSIGNED = 'Task Assigned',
  MENTION = 'Mention',
  COMMENT_ADDED = 'Comment Added',
  SYSTEM = 'System',
}

export interface INotification extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  read: boolean;
  relatedEntity?: mongoose.Types.ObjectId;
  relatedEntityType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedEntity: { type: Schema.Types.ObjectId },
    relatedEntityType: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
