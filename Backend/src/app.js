import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import passport from './config/auth.config.js';
import authRoutes from './routes/auth.route.js';
import dashboardRoutes from './routes/dashbord.route.js';
import ApiErrorHandler from './utils/apiErrorHandler.js';
import Upload from './routes/generation.Route.js'
dotenv.config();
const app = express();

app.set('trust proxy', true);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session config
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax', // use 'none' with HTTPS only for cross-site cookies
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

app.use(passport.initialize());

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/api/upload', Upload);
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server healthy ✅' });
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
