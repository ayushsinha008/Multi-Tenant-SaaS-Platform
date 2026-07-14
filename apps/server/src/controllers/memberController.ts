import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Member, MemberStatus, Role } from '../models/Member';
import { User } from '../models/User';
import { ActivityLogService } from '../services/ActivityLogService';

export const inviteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role } = req.body;
    const organizationId = req.organization!._id;

    // In a real application, you would send an email here.
    // We will just find the user or create a placeholder if they don't exist yet, 
    // or just require them to exist. Let's require them to exist for simplicity in this implementation,
    // or create them with a dummy password and isEmailVerified: false.
    let user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User with this email not found. They must register first.');
    }

    const existingMember = await Member.findOne({ organizationId, userId: user._id });
    if (existingMember) {
      throw createHttpError(409, 'User is already a member or invited');
    }

    const member = await Member.create({
      organizationId,
      userId: user._id,
      role: role || Role.MEMBER,
      status: MemberStatus.PENDING,
    });

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'invite_member',
      entityType: 'Member',
      entityId: member._id,
      details: { invitedEmail: email, role },
      req,
    });

    res.status(201).json({
      message: 'Member invited successfully',
      member,
    });
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organization!._id;
    const { status, role, page = 1, limit = 50 } = req.query;

    const query: any = { organizationId };
    if (status) query.status = status;
    if (role) query.role = role;

    const skip = (Number(page) - 1) * Number(limit);

    const [members, total] = await Promise.all([
      Member.find(query)
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name email avatar'),
      Member.countDocuments(query),
    ]);

    res.status(200).json({
      members,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const organizationId = req.organization!._id;

    if (!Object.values(Role).includes(role)) {
      throw createHttpError(400, 'Invalid role');
    }

    const member = await Member.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: { role } },
      { new: true }
    );

    if (!member) {
      throw createHttpError(404, 'Member not found');
    }

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'update_member_role',
      entityType: 'Member',
      entityId: member._id,
      details: { role },
      req,
    });

    res.status(200).json({
      message: 'Member role updated successfully',
      member,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;

    const member = await Member.findOneAndDelete({ _id: id, organizationId });

    if (!member) {
      throw createHttpError(404, 'Member not found');
    }

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'remove_member',
      entityType: 'Member',
      entityId: member._id,
      req,
    });

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Member ID
    const organizationId = req.organization!._id;

    const member = await Member.findOneAndUpdate(
      { _id: id, organizationId, userId: req.user!._id, status: MemberStatus.PENDING },
      { $set: { status: MemberStatus.ACTIVE } },
      { new: true }
    );

    if (!member) {
      throw createHttpError(404, 'Invitation not found or already accepted');
    }

    res.status(200).json({ message: 'Invitation accepted successfully', member });
  } catch (error) {
    next(error);
  }
};
