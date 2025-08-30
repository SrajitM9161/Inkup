import prisma from "../../prisma/prismaClient.js";
import ApiResponseHandler from "../utils/apiResponseHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return new ApiResponseHandler(401, "Not authenticated").send(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true },
    });

    if (!user) {
      return new ApiResponseHandler(404, "User not found").send(res);
    }

    // Clear cookie securely
    const isProd = process.env.NODE_ENV === "production";
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: isProd, // ensures HTTPS in prod
        sameSite: isProd ? "strict" : "lax",
        expires: new Date(0), // immediately expire
        path: "/",
      })
    );

    return new ApiResponseHandler(200, "Logged out successfully", {
      name: user.name,
      redirect: "/",
    }).send(res);
  } catch (err) {
    return new ApiResponseHandler(401, "Invalid or expired token").send(res);
  }
});

export default logoutUser;
