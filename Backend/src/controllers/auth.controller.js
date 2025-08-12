import bcrypt from 'bcrypt';
import prisma from '../../prisma/prismaClient.js';
import { signupSchema } from '../validators/signupSchema.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import { generateToken } from '../utils/generateToken.js';
import cookie from 'cookie';
import asyncHandler from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password, name, phoneNumber, businessName, address } = parsed.data;

  // ✅ Check if email is already in use
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered',
    });
  }

  // ✅ Check if phone number is already in use
  const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
  if (existingPhone) {
    return res.status(409).json({
      success: false,
      message: 'Phone number already registered',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser;
  try {
    newUser = await prisma.user.create({
      data: {
        email,
        name,
        phoneNumber,
        businessName,
        address,
        passwordHash: hashedPassword,
      },
    });
  } catch (error) {
    // ✅ Catch Prisma unique constraint errors just in case
    if (error.code === 'P2002' && error.meta?.target?.includes('phoneNumber')) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered',
      });
    }
    throw error;
  }

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
