import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Role } from '../models/Member';

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.member) {
        throw createHttpError(403, 'Tenant context is required');
      }

      if (!allowedRoles.includes(req.member.role)) {
        throw createHttpError(403, 'You do not have permission to perform this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
