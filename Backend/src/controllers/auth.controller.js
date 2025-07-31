import bcrypt from 'bcrypt';
import prisma from '../../prisma/prismaClient.js';
import { signupSchema } from '../validators/signupSchema.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import { generateToken } from '../utils/generateToken.js';
import cookie from 'cookie';
import asyncHandler from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res, next) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Zod Validation Error:', parsed.error.flatten().fieldErrors);
    }

    return next(
      new ApiErrorHandler(400, 'Validation failed', parsed.error.flatten().fieldErrors)
    );
  }

  const { email, password, name, phoneNumber, businessName, address } = parsed.data;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return next(new ApiErrorHandler(409, 'Email already registered'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      phoneNumber,
      businessName,
      address,
      passwordHash: hashedPassword,
    },
  });


  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
  });

  const isProd = process.env.NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      secure: isProd,              
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60,    
      path: '/',
    })
  );
  return new ApiResponseHandler(201, 'Account created successfully', {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      businessName: newUser.businessName,
      address: newUser.address,
    },
  }).send(res);
});

export default registerUser;
