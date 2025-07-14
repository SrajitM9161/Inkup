import bcrypt from 'bcryptjs';
import prisma from '../../prisma/prismaClient.js';

// Check if password is already hashed
const isHashedPassword = (password) => {
  return (
    typeof password === 'string' &&
    password.startsWith('$2a$') &&
    password.length === 60
  );
};

// Hash the password if it's not already hashed
const secureHash = async (password) => {
  if (!isHashedPassword(password)) {
    try {
      return await bcrypt.hash(password, 12);
    } catch (err) {
      console.error('Error hashing password:', err);
      throw new Error('Password encryption failed');
    }
  }
  return password;
};

// Prisma middleware for password hashing
export const passwordHashingMiddleware = async (params, next) => {
  const { model, action, args } = params;

  if (model !== 'User') return next(params);

  const userData = args?.data;

  // Handle user creation
  if (action === 'create' && userData?.passwordHash) {
    userData.passwordHash = await secureHash(userData.passwordHash);
  }

  // Handle single user update
  if (action === 'update' && userData?.passwordHash && args?.where?.id) {
    const existingUser = await prisma.user.findUnique({
      where: { id: args.where.id },
      select: { passwordHash: true },
    });

    const isSame = await bcrypt.compare(userData.passwordHash, existingUser.passwordHash);
    if (!isSame) {
      userData.passwordHash = await secureHash(userData.passwordHash);
    }
  }

  // Handle updateMany
  if (action === 'updateMany' && userData?.passwordHash) {
    userData.passwordHash = await secureHash(userData.passwordHash);
  }

  // Handle createMany
  if (action === 'createMany' && Array.isArray(userData)) {
    for (let user of userData) {
      if (user.passwordHash) {
        user.passwordHash = await secureHash(user.passwordHash);
      }
    }
  }

  // Handle upsert
  if (action === 'upsert') {
    if (args?.create?.passwordHash) {
      args.create.passwordHash = await secureHash(args.create.passwordHash);
    }

    if (args?.update?.passwordHash && args?.where?.id) {
      const existingUser = await prisma.user.findUnique({
        where: { id: args.where.id },
        select: { passwordHash: true },
      });

      const isSame = await bcrypt.compare(args.update.passwordHash, existingUser.passwordHash);
      if (!isSame) {
        args.update.passwordHash = await secureHash(args.update.passwordHash);
      }
    }
  }

  return next(params);
};
