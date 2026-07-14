import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import createHttpError from 'http-errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // If headers are already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // HttpError (created via http-errors)
  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Conflict Error',
      message: 'A resource with that unique identifier already exists.',
    });
  }

  // Default to 500 Internal Server Error
  console.error('[Unhandled Error]', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message,
  });
};
