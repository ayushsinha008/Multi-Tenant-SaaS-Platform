import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateAccessToken = (userId: mongoose.Types.ObjectId | string) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET || 'secret', {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any,
  });
};

export const generateRefreshToken = (userId: mongoose.Types.ObjectId | string) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  });
};
