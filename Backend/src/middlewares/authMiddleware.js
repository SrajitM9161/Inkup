import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import cookie from 'cookie';

const protect = async (req, res, next) => {
  try {

    const cookies = req.headers.cookie;
    if (!cookies) {
      return next(new ApiErrorHandler(401, 'No cookies provided'));
    }

    const parsedCookies = cookie.parse(cookies || '');
    const token = parsedCookies.token;

    if (!token) {
      return next(new ApiErrorHandler(401, 'Authentication token missing'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return next(new ApiErrorHandler(404, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {

    return next(new ApiErrorHandler(401, 'Invalid or expired token'));
  }
};

export default protect;
