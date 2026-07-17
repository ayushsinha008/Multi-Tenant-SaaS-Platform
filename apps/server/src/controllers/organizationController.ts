import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { Organization } from '../models/Organization';
import { Member, MemberStatus, Role } from '../models/Member';
import { ActivityLogService } from '../services/ActivityLogService';

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, slug, logo } = req.body;

    const existingOrg = await Organization.findOne({ slug }).session(session);
    if (existingOrg) {
      throw createHttpError(409, 'Organization with this slug already exists');
    }

    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const organization = await Organization.create([{
      name,
      slug,
      logo,
      ownerId: req.user!._id,
      inviteCode
    }], { session });

    await Member.create([{
      organizationId: organization[0]._id,
      userId: req.user!._id,
      role: Role.ADMIN,
      status: MemberStatus.ACTIVE
    }], { session });

    await ActivityLogService.log({
      organizationId: organization[0]._id,
      userId: req.user!._id,
      action: 'create_organization',
      entityType: 'Organization',
      entityId: organization[0]._id,
      req,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Organization created successfully',
      organization: organization[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await Member.find({ userId: req.user!._id, status: MemberStatus.ACTIVE }).populate('organizationId');
    const organizations = members.map(m => m.organizationId);

    res.status(200).json({ organizations });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ organization: req.organization });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, logo, plan, billingCycle } = req.body;
    const org = req.organization!;

    if (name) org.name = name;
    if (logo) org.logo = logo;
    if (plan) org.plan = plan;
    if (billingCycle) org.billingCycle = billingCycle;

    await org.save();

    await ActivityLogService.log({
      organizationId: org._id,
      userId: req.user!._id,
      action: 'update_organization',
      entityType: 'Organization',
      entityId: org._id,
      req,
    });

    res.status(200).json({
      message: 'Organization updated successfully',
      organization: org
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const org = req.organization!;

    // Make sure only the owner can delete
    if (org.ownerId.toString() !== req.user!._id.toString()) {
      throw createHttpError(403, 'Only the owner can delete the organization');
    }

    await Organization.deleteOne({ _id: org._id });
    await Member.deleteMany({ organizationId: org._id });
    
    // Also delete associated projects, tasks, etc. ideally, but skipped for brevity

    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const joinOrganizationByCode = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      throw createHttpError(400, 'Invite code is required');
    }

    const organization = await Organization.findOne({ inviteCode }).session(session);
    if (!organization) {
      throw createHttpError(404, 'Invalid or expired invite code');
    }

    // Check if user is already a member
    const existingMember = await Member.findOne({
      organizationId: organization._id,
      userId: req.user!._id
    }).session(session);

    if (existingMember) {
      throw createHttpError(409, 'You are already a member of this workspace');
    }

    // Add user as MEMBER
    await Member.create([{
      organizationId: organization._id,
      userId: req.user!._id,
      role: Role.MEMBER,
      status: MemberStatus.ACTIVE
    }], { session });

    await ActivityLogService.log({
      organizationId: organization._id,
      userId: req.user!._id,
      action: 'join_organization_via_code',
      entityType: 'Organization',
      entityId: organization._id,
      req,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Joined workspace successfully',
      organization
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
