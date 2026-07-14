import mongoose from 'mongoose';
import { ActivityLog } from '../models/ActivityLog';

interface LogActivityParams {
  organizationId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  action: string;
  entityType: string;
  entityId: mongoose.Types.ObjectId | string;
  details?: Record<string, any>;
  req?: any; // Express Request to extract IP, browser, etc.
}

export class ActivityLogService {
  static async log(params: LogActivityParams) {
    try {
      let ipAddress, device, browser;

      if (params.req) {
        ipAddress = params.req.ip || params.req.headers['x-forwarded-for'];
        const userAgent = params.req.headers['user-agent'] || '';
        browser = userAgent; // Basic parsing for now. Could use user-agent parser library.
      }

      await ActivityLog.create({
        organizationId: params.organizationId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details,
        ipAddress,
        device,
        browser,
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      // We usually don't want to throw an error for logging failures to prevent disrupting the main flow
    }
  }
}
