import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

export enum MemberStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
}

export interface IMember extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: Role;
  status: MemberStatus;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: Object.values(Role), default: Role.MEMBER },
    status: { type: String, enum: Object.values(MemberStatus), default: MemberStatus.PENDING },
  },
  { timestamps: true }
);

// Ensure a user can only be a member of an organization once
memberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export const Member = mongoose.model<IMember>('Member', memberSchema);
