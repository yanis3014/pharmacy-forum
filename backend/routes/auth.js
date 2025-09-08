// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const auth = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register a new user
router.post(
  "/register",
  [
    check("firstName", "Please enter your first name").not().isEmpty(),
    check("lastName", "Please enter your last name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
    check("phone", "Please enter your phone number").not().isEmpty(),
    check("profession", "Please select your profession").not().isEmpty(),
  ],
  async (req, res) => {
    // --- LOGS DE DÉBOGAGE ---
    console.log("Tentative d'inscription reçue.");
    console.log("Données reçues du formulaire :", req.body);
    // -----------------------

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // --- LOG DE DÉBOGAGE ---
      console.log("Erreur de validation des données :", errors.array());
      // -----------------------
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      profession,
      professionOther, // Ajout de professionOther
      grade,
      studentLevel,
      institution,
    } = req.body;
    // ===================================

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // === CRÉATION DE L'UTILISATEUR MISE À JOUR ===
      user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        profession,
        professionOther, // Ajout de professionOther
        grade,
        studentLevel,
        institution,
      });
      // ===========================================

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      const verificationToken = user.getEmailVerificationToken();

      // --- LOG DE DÉBOGAGE ---
      console.log(
        "Tentative de sauvegarde de l'utilisateur dans la base de données..."
      );
      // -----------------------

      await user.save();

      // --- LOG DE DÉBOGAGE ---
      console.log("Utilisateur sauvegardé avec succès !");
      console.log("Envoi de l'e-mail de vérification...");
      // -----------------------

      const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
      const message = `
        <h1>Vérification de votre compte</h1>
        <p>Merci de vous être inscrit ! Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
        <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
      `;
      await sendEmail({
        email: user.email,
        subject: "Vérification de votre compte Pharmacy Forum",
        message,
      });

      // --- LOG DE DÉBOGAGE ---
      console.log("E-mail envoyé. Réponse envoyée au frontend.");
      // -----------------------

      res.status(201).json({
        success: true,
        msg: "Un e-mail de vérification a été envoyé.",
      });
    } catch (err) {
      // --- LOG DE DÉBOGAGE ---
      console.error(
        "ERREUR CATCH : Une erreur est survenue lors de l'inscription :",
        err.message
      );
      // -----------------------
      res.status(500).send("Server Error");
    }
  }
);

// ... (le reste du fichier reste identique)
// @route   GET /api/auth/verify-email
// @desc    Verify email
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ msg: "Token de vérification manquant" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({ emailVerificationToken: hashedToken });

    if (!user) {
      return res.status(400).json({ msg: "Token invalide ou expiré" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ success: true, msg: "E-mail vérifié avec succès !" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Tentative de connexion reçue.");
    const { email, password } = req.body;
    console.log("Email reçu:", email);
    console.log("Mot de passe reçu:", password);

    try {
      let user = await User.findOne({ email });
      if (!user) {
        console.log("Erreur: Utilisateur non trouvé pour l'email:", email);
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      console.log("Utilisateur trouvé:", user.email);
      console.log("Mot de passe haché dans la DB:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Erreur: La comparaison de mot de passe a échoué.");
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      console.log("La comparaison de mot de passe a réussi.");

      if (!user.isVerified) {
        console.log("Erreur: L'utilisateur n'est pas vérifié.");
        return res.status(401).json({
          msg: "Veuillez vérifier votre e-mail avant de vous connecter.",
        });
      }

      console.log("Connexion réussie. Création du token...");

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/auth
// @desc    Get user by token
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
