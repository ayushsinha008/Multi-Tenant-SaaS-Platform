import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  logo?: string;
  ownerId: mongoose.Types.ObjectId;
  plan: 'FREE' | 'PRO' | 'BUSINESS';
  billingCycle?: 'MONTHLY' | 'YEARLY';
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['FREE', 'PRO', 'BUSINESS'], default: 'FREE' },
    billingCycle: { type: String, enum: ['MONTHLY', 'YEARLY'] }
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);
