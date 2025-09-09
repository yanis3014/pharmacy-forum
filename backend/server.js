// backend/server.js
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define API Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/workshops", require("./routes/workshops"));
app.use("/api/admin", require("./routes/admin"));

// =======================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
