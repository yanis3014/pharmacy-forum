// backend/routes/workshops.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Workshop = require("../models/Workshop");
const User = require("../models/User");

// @route   GET /api/workshops
// @desc    Get all workshops
router.get("/", async (req, res) => {
  try {
    const workshops = await Workshop.find()
      .populate("leader", "firstName lastName")
      .populate("registrations.user", "firstName lastName email");

    res.json(workshops);
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
      return res.status(404).json({ msg: "Workshop not found" });
    }

    const isAlreadyRegistered = workshop.registrations.some((reg) =>
      reg.user.equals(req.user.id)
    );
    if (isAlreadyRegistered) {
      return res.status(400).json({
        msg: "Vous êtes déjà inscrit ou en liste d'attente pour cet atelier.",
      });
    }

    // CORRECTION DE LA VÉRIFICATION DE LA DATE
    const startDate = new Date(workshop.date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(workshop.date);
    endDate.setHours(23, 59, 59, 999);

    const userWorkshopsOnSameDay = await Workshop.findOne({
      "registrations.user": req.user.id,
      date: { $gte: startDate, $lte: endDate },
    });

    if (userWorkshopsOnSameDay) {
      return res.status(400).json({
        msg: `Vous êtes déjà inscrit à un atelier le ${workshop.date.toLocaleDateString()}.`,
      });
    }

    const confirmedRegistrations = workshop.registrations.filter(
      (reg) => reg.status === "confirmed"
    ).length;

    let newUserStatus;
    if (confirmedRegistrations < workshop.capacity) {
      newUserStatus = "pre-registered";
    } else {
      newUserStatus = "waiting_list";
    }

    workshop.registrations.push({ user: req.user.id, status: newUserStatus });
    await workshop.save();

    if (newUserStatus === "waiting_list") {
      return res.json({
        msg: "L'atelier est complet. Vous avez été ajouté à la liste d'attente.",
      });
    }

    res.json({
      msg: "Pré-inscription réussie ! Pensez à valider votre paiement sur place.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/workshops/:id/unregister
// @desc    Unregister a user from a workshop
router.delete("/:id/unregister", auth, async (req, res) => {
  try {
    // CORRECTION DE LA LOGIQUE D'ANNULATION
    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      { $pull: { registrations: { user: req.user.id } } },
      { new: true }
    );

    if (!workshop) {
      return res.status(404).json({ msg: "Workshop not found" });
    }

    res.json({ msg: "Inscription annulée avec succès." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/workshops/my-workshops
// @desc    Get workshops for the workshop leader
router.get("/my-workshops", auth, async (req, res) => {
  try {
    const myWorkshops = await Workshop.find({ leader: req.user.id })
      .populate("registrations.user", "firstName lastName email")
      .populate("leader", "firstName lastName");

    if (myWorkshops.length === 0) {
      return res
        .status(404)
        .json({ msg: "No workshops found for this leader." });
    }

    res.json(myWorkshops);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/workshops/my-registrations
// @desc    Get workshops user is registered for
router.get("/my-registrations", auth, async (req, res) => {
  try {
    const myRegistrations = await Workshop.find({
      "registrations.user": req.user.id,
    }).populate("leader", "firstName lastName");

    res.json(myRegistrations);
  } catch (err) {
    // PARTIE MANQUANTE AJOUTÉE ICI
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
