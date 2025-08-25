// backend/routes/users.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// @route   GET /api/users/profile
// @desc    Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
router.put("/profile", auth, async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    profession,
    grade,
    studentLevel,
    institution,
  } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const updatedFields = {
      firstName,
      lastName,
      phone,
      profession,
      grade,
      studentLevel,
      institution,
    };

    let updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
