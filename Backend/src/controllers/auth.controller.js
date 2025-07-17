import prisma from '../../prisma/prismaClient.js';
import { signupSchema } from '../validators/signupSchema.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import { generateToken } from '../utils/generateToken.js';

export const registerUser = async (req, res, next) => {
  // 1. Validate input
  const parsed = signupSchema.safeParse(req.body);

 if (!parsed.success) {
  console.log('🛑 Zod Validation Error:', parsed.error.flatten().fieldErrors);
  console.log('🔍 Request body:', req.body);
  return next(new ApiErrorHandler(400, 'Validation Failed', parsed.error.flatten().fieldErrors));
}
  const { email, password, name, phoneNumber, businessName, address } = parsed.data;

  try {
    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ApiErrorHandler(409, 'Email already registered'));
    }

    // 3. Create user (password will be hashed by Prisma middleware)
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phoneNumber,
        businessName,
        address,
        passwordHash: password,
      },
    });

    // 4. Generate token
    const token = generateToken(newUser);

    // 5. Send response
    return new ApiResponseHandler(201, 'Account created successfully', {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        businessName: newUser.businessName,
        address: newUser.address,
      },
    }).send(res);
  } catch (err) {
    console.error('Register Error:', err);
    return next(new ApiErrorHandler(500, 'Something went wrong', [], err.stack));
  }
};

export default registerUser;
