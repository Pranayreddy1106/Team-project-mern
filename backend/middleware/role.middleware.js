// middleware/role.middleware.js

/**
 * Restricts access to specified roles.
 * Usage: router.get(..., verifyToken, restrictTo('admin', 'instructor'), handler);
 */
export const restrictTo = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export const requireInstructor = (req, res, next) => {
  try {
    // User should be attached by verifyToken middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { role } = req.user;
    if (role !== "instructor" && role !== "admin") {
      return res.status(403).json({ message: "Instructor role required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};