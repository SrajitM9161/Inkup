import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import passport from './config/auth.config.js';
import authRoutes from './routes/auth.route.js';
dotenv.config();
import dashboardRoutes from './routes/dashbord.route.js';
import ApiErrorHandler from './utils/apiErrorHandler.js';
import generateRoutes from './routes/gerate.route.js';
import tryonRoutes from './routes/tryon.route.js'
import outputimage from "./routes/outputimage.route.js"
const app = express();

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
    maxAge: 86400000, 
  },
}));

app.use(passport.initialize());


app.use('/temp', express.static(path.join(process.cwd(), 'Public/temp')));

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/api/upload', generateRoutes);
app.use('/api/tryon', tryonRoutes);
app.use('/api',outputimage)
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server healthy ' });
});

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
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    data: null,
  });
});

export default app;