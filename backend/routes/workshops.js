// backend/routes/workshops.js
const express = require("express");
const router = express.Router();
const Workshop = require("../models/Workshop");
const auth = require("../middleware/authMiddleware");

// @route   GET /api/workshops
// @desc    Get all workshops with optional day filter
router.get("/", async (req, res) => {
  try {
    const { day } = req.query;
    let filter = {};
    if (day) {
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
    console.error("Erreur sur GET /api/workshops:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET /api/workshops/my-registrations
// @desc     Get all workshops a user is registered for
router.get("/my-registrations", auth, async (req, res) => {
  try {
    const workshops = await Workshop.find({
      "registrations.user": req.user.id,
    }).populate("leader", "firstName lastName");
    res.json(workshops);
  } catch (err) {
    console.error(
      "Erreur sur GET /api/workshops/my-registrations:",
      err.message
    );
    res.status(500).send("Server Error");
  }
});

// @route    GET /api/workshops/my-workshops
// @desc     Get all workshops led by the current user
router.get("/my-workshops", auth, async (req, res) => {
  try {
    const workshops = await Workshop.find({ leader: req.user.id }).populate(
      "registrations.user",
      "firstName lastName email profession"
    );
    res.json(workshops);
  } catch (err) {
    console.error("Erreur sur GET /api/workshops/my-workshops:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/workshops/:id/registrations
// @desc    Get all registrations for a specific workshop
router.get("/:id/registrations", auth, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).populate(
      "registrations.user",
      "firstName lastName email"
    );
    if (!workshop) {
      return res.status(404).json({ msg: "Atelier non trouvé." });
    }
    res.json(workshop.registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur.");
  }
});

// @route   GET /api/workshops/:id
// @desc    Get a single workshop by ID (DOIT ÊTRE APRÈS LES ROUTES SPÉCIFIQUES)
router.get("/:id", async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).populate(
      "leader",
      "firstName lastName"
    );
    if (!workshop) return res.status(404).json({ msg: "Workshop not found" });
    res.json(workshop);
  } catch (err) {
    console.error(
      `Erreur sur GET /api/workshops/${req.params.id}:`,
      err.message
    );
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/workshops/:id/register
// @desc    Register for a workshop (AVEC VÉRIFICATION DE DATE)
router.post("/:id/register", auth, async (req, res) => {
  try {
    const workshopToRegister = await Workshop.findById(req.params.id);
    if (!workshopToRegister) {
      return res.status(404).json({ msg: "Atelier non trouvé." });
    }

    const isAlreadyRegistered = workshopToRegister.registrations.some(
      (reg) => reg.user.toString() === req.user.id
    );
    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ msg: "Vous êtes déjà inscrit à cet atelier." });
    }

    // === NOUVELLE LOGIQUE DE VÉRIFICATION ===
    const userRegistrations = await Workshop.find({
      "registrations.user": req.user.id,
    });
    const workshopDate = new Date(workshopToRegister.date).toLocaleDateString();

    const hasRegistrationOnSameDay = userRegistrations.some(
      (regWorkshop) =>
        new Date(regWorkshop.date).toLocaleDateString() === workshopDate
    );

    if (hasRegistrationOnSameDay) {
      return res
        .status(400)
        .json({
          msg: "Vous êtes déjà inscrit à un autre atelier le même jour.",
        });
    }
    // =====================================

    workshopToRegister.registrations.push({
      user: req.user.id,
      status: "pre-registered",
    });
    await workshopToRegister.save();
    res.json(workshopToRegister);
  } catch (err) {
    console.error(
      `Erreur sur POST /api/workshops/${req.params.id}/register:`,
      err.message
    );
    res.status(500).send("Erreur du serveur.");
  }
});

// @route   DELETE /api/workshops/:id/unregister
// @desc    Unregister from a workshop
router.delete("/:id/unregister", auth, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ msg: "Atelier non trouvé." });

    workshop.registrations = workshop.registrations.filter(
      (reg) => reg.user.toString() !== req.user.id
    );
    await workshop.save();
    res.json({ msg: "Inscription annulée avec succès." });
  } catch (err) {
    console.error(
      `Erreur sur DELETE /api/workshops/${req.params.id}/unregister:`,
      err.message
    );
    res.status(500).send("Erreur du serveur.");
  }
});

module.exports = router;
