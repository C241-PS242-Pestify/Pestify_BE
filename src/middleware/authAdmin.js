const authorizeAdmin = (req, res, next) => {
  const adminEmail = "admin@pestify.com";
  if (req.user && req.user.email === adminEmail) {
    next();
  } else {
    res.status(403).json({ error: "Access denied, admin only" });
  }
};

module.exports = authorizeAdmin;
