import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User, IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check cookies first
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } 
    // Fallback to Bearer token
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw createHttpError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret') as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(createHttpError(401, 'Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(createHttpError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};
