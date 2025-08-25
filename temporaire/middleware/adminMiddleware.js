// backend/middleware/adminMiddleware.js
const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    // On suppose que le middleware 'auth' a déjà été exécuté
    const user = await User.findById(req.user.id);

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
