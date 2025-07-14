import bcrypt from 'bcryptjs';
import prisma from '../../prisma/prismaClient.js';
import { signupSchema } from '../validators/signupSchema.js';
import { generateToken } from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation Failed',
      errors: parsed.error.flatten()
    });
  }

  const { email, password, name, phoneNumber, businessName, image } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const passwordHash = password ? await bcrypt.hash(password, 12) : null;

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      phoneNumber,
      businessName,
      passwordHash,
      image
    }
  });

  const token = generateToken(newUser);

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
    }
  });
};
