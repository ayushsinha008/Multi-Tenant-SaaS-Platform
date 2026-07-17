import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Load env from common locations (platform env vars always win — dotenv does not override)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';
import { initSocket } from './socket';
import { initCronJobs } from './cron/jobs';

// Connect Database
connectDB();

// Initialize Cron Jobs
initCronJobs();

// Initialize Express
const app = express();
const httpServer = createServer(app);

// Required behind Render / reverse proxies (rate limit + secure cookies)
app.set('trust proxy', 1);

const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

// Socket.io initialization
const io = new Server(httpServer, {
  cors: {
    origin: frontendOrigin,
    credentials: true,
  },
});
initSocket(io);

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/', limiter);

// Routes
app.use('/api/v1', apiRoutes);

// Test Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
