import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../models/ActivityLog';

export const getActivityLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organization!._id;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find({ organizationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name email avatar'),
      ActivityLog.countDocuments({ organizationId }),
    ]);

    res.status(200).json({
      logs,
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
