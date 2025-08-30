
export function ensureProfileComplete(req, res, next) {
  const user = req.user;

  if (user?.needsProfileCompletion) {
    const missing = user.missingFields?.join(",") || "";
    return res.redirect(`${process.env.CLIENT_URL}/complete-profile?missing=${missing}`);
  }

  next();
}
