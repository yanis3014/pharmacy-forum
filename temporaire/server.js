// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes de l'API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/workshops", require("./routes/workshops"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users")); // <-- Cette ligne est essentielle

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
