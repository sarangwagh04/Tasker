import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

// Basic Route
app.get("/", (req, res) => {
  res.send("Task Manager API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


import bcrypt from "bcryptjs";
import User, { UserRole } from "./models/User.model";

// Seed Admin User
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@taskmanager.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("Pass@123", salt);
      await User.create({
        name: "Admin",
        email: "admin@taskmanager.com",
        passwordHash,
        role: UserRole.ADMIN,
      });
      console.log("Admin user seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedAdmin();
});
