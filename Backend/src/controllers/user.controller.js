import prisma from '../../prisma/prismaClient.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import { Prisma } from '@prisma/client';

export const getMe = asyncHandler(async (req, res) => {
    const user = req.user;
    return new ApiResponseHandler(200, 'User data fetched', { user }).send(res);
});

export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { businessName, phoneNumber, address } = req.body;
  const userId = req.user.id;

  if (!businessName || !phoneNumber || !address) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        businessName,
        phoneNumber,
        address,
        isProfileCompleted: true,
      },
    });
    return new ApiResponseHandler(200, 'Profile updated successfully', { user: updatedUser }).send(res);
  
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('phoneNumber')) {
          return res.status(409).json({
            success: false,
            message: 'This phone number is already registered to another account.',
          });
        }
      }
    }
    
    console.error("Error updating user profile:", error);
    next(error);
  }
});