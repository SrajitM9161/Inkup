import prisma from '../../prisma/prismaClient.js';

export const checkProfileCompletion = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user found in token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        address: true,
        phoneNumber: true,
        businessName: true,
        email: true,
        name: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requiredFields = ['address', 'phoneNumber', 'businessName'];
    const missingFields = requiredFields.filter(field => !user[field] || user[field].trim() === '');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Please complete your profile to continue.',
        missingFields,
        userId: user.id
      });
    }
    req.fullUser = user;

    next();
  } catch (err) {
    console.error('Profile Check Error:', err);
    res.status(500).json({ message: 'Internal server error while checking profile' });
  }
};
