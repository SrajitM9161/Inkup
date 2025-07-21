import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import cookie from 'cookie';

const protect = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;

    if (!cookies || !cookies.includes('token')) {
      return next(new ApiErrorHandler(401, 'Authentication required'));
    }

    const { token } = cookie.parse(cookies || '');

    if (!token) {
      return next(new ApiErrorHandler(401, 'No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return next(new ApiErrorHandler(404, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return next(new ApiErrorHandler(401, 'Invalid or expired token'));
  }
};

export default protect;
