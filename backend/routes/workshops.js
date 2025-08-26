// backend/routes/workshops.js
const express = require("express");
const router = express.Router();
const Workshop = require("../models/Workshop");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// @route   GET /api/workshops
// @desc    Get all workshops with optional day filter
router.get("/", async (req, res) => {
  try {
    const { day } = req.query;
    let filter = {};

    if (day) {
      // On s'assure que la date correspond au jour demandé (24 ou 25)
      const startDate = new Date(`2025-10-${day}T00:00:00.000Z`);
      const endDate = new Date(`2025-10-${day}T23:59:59.999Z`);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const workshops = await Workshop.find(filter).populate(
      "leader",
      "firstName lastName"
    );
    res.json(workshops);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/workshops/:id
// @desc    Get a single workshop by ID
router.get("/:id", async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).populate(
      "leader",
      "firstName lastName"
    );
    if (!workshop) {
      return res.status(404).json({ msg: "Workshop not found" });
    }
    res.json(workshop);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/workshops/:id/register
// @desc    Register for a workshop
router.post("/:id/register", auth, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ msg: "Atelier non trouvé." });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const isAlreadyRegistered = workshop.registrations.some(
      (reg) => reg.user.toString() === req.user.id
    );
    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ msg: "Vous êtes déjà inscrit à cet atelier." });
    }

    // Ajouter l'inscription
    workshop.registrations.push({
      user: req.user.id,
      status: "pre-registered",
    });
    await workshop.save();
    res.json(workshop);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur.");
  }
});

// @route    GET api/workshops/my-registrations
// @desc     Get all workshops a user is registered for
router.get("/my-registrations", auth, async (req, res) => {
  try {
    const workshops = await Workshop.find({
      "registrations.user": req.user.id,
    }).populate("leader", "firstName lastName");
    res.json(workshops);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
