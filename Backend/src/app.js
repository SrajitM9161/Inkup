import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import passport from './config/auth.config.js';
import authRoutes from './routes/auth.route.js';
import dashboardRoutes from './routes/dashbord.route.js';
import ApiErrorHandler from './utils/apiErrorHandler.js';
import generateRoutes from './routes/uploads.route.js';
import tryonRoutes from './routes/tryon.route.js';
import outputimage from './routes/outputimage.route.js';
import imageRoutes from './routes/editimage.routes.js';
import uploadUsertatto from './routes/uploadusertattoo.routes.js';
import * as Sentry from '@sentry/node';
import './instrument.js';

dotenv.config();

const app = express();

// Initialize Sentry request handler and tracing
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.set('trust proxy', true);

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(helmet());

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 86400000, // 1 day
  },
}));

app.use(passport.initialize());

app.use('/temp', express.static(path.join(process.cwd(), 'Public/temp')));

// Your routes here (before Sentry error handler)
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/api/upload', generateRoutes);
app.use('/api/tryon', tryonRoutes);
app.use('/api', outputimage);
app.use("/api/images", imageRoutes);
app.use("/api/tattoo", uploadUsertatto);
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server healthy' });
});

app.get('/test-error', (req, res) => {
  throw new Error('Test backend Sentry error');
});

// Sentry error handler middleware MUST come after all routes
app.use(Sentry.Handlers.errorHandler());

// Your custom error handler middleware must come last
app.use((err, req, res, next) => {
  if (err instanceof ApiErrorHandler) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: null,
    });
  }

  console.error('Unhandled Error:', err);

  // Optional: capture unhandled error with Sentry manually
  Sentry.captureException(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    data: null,
  });
});

export default app;
