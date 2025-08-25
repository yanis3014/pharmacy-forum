// backend/models/Workshop.js
const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pre-registered", "confirmed", "waiting_list"],
    default: "pre-registered",
  },
  present: { type: Boolean, default: false },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const WorkshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  date: { type: Date, required: true }, // <-- NOUVEAU CHAMP
  capacity: { type: Number, required: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  registrations: [RegistrationSchema],
});

module.exports = mongoose.model("Workshop", WorkshopSchema);
