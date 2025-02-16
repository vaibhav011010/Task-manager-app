require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api/tasks", taskRoutes);

// Connect to Database
connectDB();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
