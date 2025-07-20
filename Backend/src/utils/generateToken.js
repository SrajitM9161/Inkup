import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT token for the given user
 * @param {Object} user - The user object (must have id and email)
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d', // Change to '15m' if short-lived is needed
    }
  );
};
