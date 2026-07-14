import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { Member, MemberStatus } from '../models/Member';
import { IOrganization, Organization } from '../models/Organization';

declare global {
  namespace Express {
    interface Request {
      organization?: IOrganization;
      member?: any; // IMember
    }
  }
}

export const requireTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw createHttpError(400, 'x-tenant-id header is required');
    }

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      throw createHttpError(400, 'Invalid tenant ID');
    }

    if (!req.user) {
      throw createHttpError(401, 'Authentication required');
    }

    const organization = await Organization.findById(tenantId);
    if (!organization) {
      throw createHttpError(404, 'Organization not found');
    }

    const member = await Member.findOne({
      organizationId: tenantId,
      userId: req.user._id,
      status: MemberStatus.ACTIVE,
    });

    if (!member) {
      throw createHttpError(403, 'You do not have access to this organization');
    }

    req.organization = organization;
    req.member = member;

    next();
  } catch (error) {
    next(error);
  }
};
