// backend/models/User.js
const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  profession: { type: String, required: true },
  professionOther: { type: String, required: false }, // CHAMP AJOUTÉ
  grade: { type: String, required: false },
  studentLevel: { type: String, required: false },
  institution: { type: String, required: false },
  role: {
    type: String,
    enum: ["participant", "workshop_leader", "admin"],
    default: "participant",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
});

UserSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  return verificationToken;
};

module.exports = mongoose.model("User", UserSchema);
