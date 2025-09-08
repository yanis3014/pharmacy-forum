// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const Workshop = require("../models/Workshop");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const sendEmail = require("../utils/sendEmail");

const adminAuth = [auth, admin];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

router.post(
  "/workshops",
  [adminAuth, upload.single("image")],
  async (req, res) => {
    const { title, description, capacity, leader, date } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    try {
      const newWorkshopData = {
        title,
        description,
        imageUrl: imagePath,
        capacity,
        date,
      };
      if (leader) newWorkshopData.leader = leader;
      const newWorkshop = new Workshop(newWorkshopData);
      await newWorkshop.save();
      res.status(201).json(newWorkshop);
    } catch (err) {
      console.error("Erreur lors de la création de l'atelier:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/workshops/:id",
  [adminAuth, upload.single("image")],
  async (req, res) => {
    const { title, description, capacity, leader, date } = req.body;

    let workshopFields = { title, description, capacity, date };
    if (req.file) {
      workshopFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    let updateOperation = { $set: workshopFields };

    // Gérer la mise à jour du leader
    if (leader) {
      updateOperation.$set.leader = leader;
    } else {
      // Si le champ leader est vide, on le supprime de l'atelier
      updateOperation.$unset = { leader: "" };
    }

    try {
      const workshop = await Workshop.findByIdAndUpdate(
        req.params.id,
        updateOperation,
        { new: true }
      );
      if (!workshop) return res.status(404).json({ msg: "Workshop not found" });
      res.json(workshop);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'atelier:", err.message);
      res.status(500).send("Server Error");
    }
  }
);
router.delete("/workshops/:id", adminAuth, async (req, res) => {
  try {
    await Workshop.findByIdAndDelete(req.params.id);
    res.json({ msg: "Workshop removed successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/users", adminAuth, async (req, res) => {
  try {
    const { profession, role, search } = req.query;
    let filter = { isVerified: true };
    if (profession) filter.profession = profession;
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    const registeredWorkshops = await Workshop.find({
      "registrations.user": user._id,
    }).select("title");
    const userWithWorkshops = user.toObject();
    userWithWorkshops.registeredWorkshops = registeredWorkshops;
    res.json(userWithWorkshops);
  } catch (err) {
    console.error(
      `Erreur sur GET /api/admin/users/${req.params.id}:`,
      err.message
    );
    res.status(500).send("Server Error");
  }
});

router.put("/users/:id/role", adminAuth, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.post("/users", adminAuth, async (req, res) => {
  const { firstName, lastName, email, password, role, ...otherFields } =
    req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ msg: "Un utilisateur avec cet email existe déjà" });
    user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      isVerified: true,
      ...otherFields,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Workshop.updateMany(
      {},
      { $pull: { registrations: { user: req.params.id } } }
    );
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.put("/registrations/confirm", adminAuth, async (req, res) => {
  const { workshopId, userId } = req.body;
  try {
    const workshop = await Workshop.findById(workshopId);
    const user = await User.findById(userId);
    if (!workshop || !user)
      return res
        .status(404)
        .json({ msg: "Atelier ou utilisateur non trouvé." });
    const registration = workshop.registrations.find((reg) =>
      reg.user.equals(userId)
    );
    if (!registration)
      return res.status(404).json({ msg: "Inscription non trouvée." });
    registration.status = "confirmed";
    await workshop.save();
    const message = `<h1>Confirmation d'inscription</h1><p>Bonjour ${user.firstName},</p><p>Nous avons le plaisir de vous confirmer votre inscription à l'atelier "${workshop.title}".</p><p>Nous vous attendons avec impatience !</p>`;
    await sendEmail({
      email: user.email,
      subject: `Confirmation de votre inscription à l'atelier : ${workshop.title}`,
      message,
    });
    res.json(workshop);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// === ROUTE DES STATISTIQUES CORRIGÉE ===
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const workshops = await Workshop.find();
    const totalVerifiedUsers = await User.countDocuments({ isVerified: true });
    const totalUnverifiedUsers = await User.countDocuments({
      isVerified: false,
    });

    const usersByProfession = await User.aggregate([
      { $match: { isVerified: true } },
      { $group: { _id: "$profession", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const workshopDetails = workshops.map((ws) => ({
      name: ws.title,
      confirmed: (ws.registrations || []).filter(
        (r) => r.status === "confirmed"
      ).length,
      // Ajout du comptage des pré-inscrits
      preRegistered: (ws.registrations || []).filter(
        (r) => r.status === "pre-registered"
      ).length,
      waiting: (ws.registrations || []).filter(
        (r) => r.status === "waiting_list"
      ).length,
      capacity: ws.capacity,
    }));

    const stats = {
      totalVerifiedUsers,
      totalUnverifiedUsers,
      totalWorkshops: workshops.length,
      usersByProfession,
      workshopDetails,
    };
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
