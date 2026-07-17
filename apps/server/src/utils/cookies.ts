import { CookieOptions } from 'express';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Cross-origin deploys (Vercel frontend + Render API) need SameSite=None; Secure.
 * Localhost (same-site different ports) works fine with Lax.
 */
export const authCookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
  maxAge,
});

export const clearAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};

export const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 mins
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
