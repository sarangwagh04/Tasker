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

// Seed Users
const seedUsers = async () => {
  try {
    const usersToSeed = [
      { name: "Admin", email: "admin@taskmanager.com", role: UserRole.ADMIN },
      { name: "Manager", email: "manage@taskmanager.com", role: UserRole.MANAGER },
      { name: "User", email: "user@taskmanager.com", role: UserRole.USER }
    ];

    for (const user of usersToSeed) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("Pass@123", salt);
        await User.create({
          name: user.name,
          email: user.email,
          passwordHash,
          role: user.role,
        });
        console.log(`${user.role} user seeded successfully.`);
      }
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedUsers();
});
