
import prisma from "../../prisma/prismaClient.js";

export const checkGoogleProfileCompletion = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found in request"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        phoneNumber: true,
        address: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const requiredFields = ["businessName", "phoneNumber", "address"];
    const missingFields = requiredFields.filter(
      field => !user[field] || String(user[field]).trim() === ""
    );
    if (missingFields.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Please complete your profile to continue.",
        missingFields,
        userId: user.id
      });
    }

 
    req.fullUser = user;
    next();

  } catch (err) {
    console.error("Google Profile Completion Check Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while checking Google profile completion"
    });
  }
};
