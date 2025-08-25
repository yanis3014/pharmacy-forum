// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  profession: { type: String, required: true }, // ex: Etudiant, Pharmacien, Enseignant
  grade: { type: String, required: false }, // ex: Pharmacien d'officine, Biologiste
  studentLevel: { type: String, required: false }, // ex: 5ème année
  institution: { type: String, required: false }, // ex: Faculté de Pharmacie de Monastir
  role: {
    type: String,
    enum: ["participant", "workshop_leader", "admin"],
    default: "participant",
  },
});

module.exports = mongoose.model("User", UserSchema);
