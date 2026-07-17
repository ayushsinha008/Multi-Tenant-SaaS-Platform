import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { User } from '../models/User';
import { Member, MemberStatus } from '../models/Member';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  authCookieOptions,
  clearAuthCookieOptions,
} from '../utils/cookies';
import jwt from 'jsonwebtoken';

const setAuthCookies = (res: Response, userId: string) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  res.cookie('accessToken', accessToken, authCookieOptions(ACCESS_TOKEN_MAX_AGE));
  res.cookie('refreshToken', refreshToken, authCookieOptions(REFRESH_TOKEN_MAX_AGE));
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'User with this email already exists');
    }

    const user = await User.create({ name, email, password });
    setAuthCookies(res, String(user._id));

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw createHttpError(401, 'Invalid email or password');
    }

    setAuthCookies(res, String(user._id));

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, avatar, uid } = req.body;

    if (!email || !uid) {
      throw createHttpError(400, 'Email and UID are required');
    }

    let user = await User.findOne({ email });

    // If user doesn't exist, create them
    if (!user) {
      // Create a random password for OAuth users since they don't use it
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      user = await User.create({ 
        name: name || 'User', 
        email, 
        password: randomPassword,
        avatar,
        googleId: uid
      });
    } else {
      // Always update avatar and googleId for existing users on every Google login
      if (avatar) user.avatar = avatar;
      if (uid) (user as any).googleId = uid;
      await user.save();
    }

    setAuthCookies(res, String(user._id));

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('accessToken', clearAuthCookieOptions);
    res.clearCookie('refreshToken', clearAuthCookieOptions);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token required');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as { id: string };
    
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    const accessToken = generateAccessToken(user._id);
    res.cookie('accessToken', accessToken, authCookieOptions(ACCESS_TOKEN_MAX_AGE));

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      next(createHttpError(401, 'Invalid or expired refresh token'));
    } else {
      next(error);
    }
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      user: {
        id: req.user?._id,
        name: req.user?.name,
        email: req.user?.email,
        avatar: req.user?.avatar,
        preferences: req.user?.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, avatar } = req.body;
    
    if (name) req.user!.name = name;
    if (avatar) req.user!.avatar = avatar;

    await req.user!.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: req.user?._id,
        name: req.user?.name,
        email: req.user?.email,
        avatar: req.user?.avatar,
        preferences: req.user?.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { emailNotifications, pushNotifications, marketingEmails } = req.body;
    
    if (typeof emailNotifications === 'boolean') req.user!.preferences.emailNotifications = emailNotifications;
    if (typeof pushNotifications === 'boolean') req.user!.preferences.pushNotifications = pushNotifications;
    if (typeof marketingEmails === 'boolean') req.user!.preferences.marketingEmails = marketingEmails;

    await req.user!.save();

    res.status(200).json({
      message: 'Preferences updated successfully',
      user: {
        id: req.user?._id,
        name: req.user?.name,
        email: req.user?.email,
        avatar: req.user?.avatar,
        preferences: req.user?.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingInvitations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invitations = await Member.find({
      userId: req.user!._id,
      status: MemberStatus.PENDING,
    }).populate('organizationId', 'name logo slug');
    
    res.status(200).json({ invitations });
  } catch (error) {
    next(error);
  }
};

export const acceptGlobalInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Member ID

    const member = await Member.findOneAndUpdate(
      { _id: id, userId: req.user!._id, status: MemberStatus.PENDING },
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

export const rejectGlobalInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Member ID

    const member = await Member.findOneAndDelete(
      { _id: id, userId: req.user!._id, status: MemberStatus.PENDING }
    );

    if (!member) {
      throw createHttpError(404, 'Invitation not found or already acted upon');
    }

    res.status(200).json({ message: 'Invitation rejected successfully' });
  } catch (error) {
    next(error);
  }
};
