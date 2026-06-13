import express, { Request, Response } from "express";
import Task from "../models/Task.model";
import { protect, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../models/User.model";

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private (All Roles)
router.get("/", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    // Note: To show user-specific data, we could filter here, 
    // but the prompt implies users can "see the tasks", meaning a general list or their assigned tasks.
    // For simplicity, we'll return all tasks, populated with the creator's name.
    const tasks = await Task.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private (Admin only)
router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, status } = req.body;

      const task = await Task.create({
        title,
        description,
        status: status || "Pending",
        createdBy: req.user?._id,
      });

      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private (Admin, Manager)
router.put(
  "/:id",
  protect,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }

      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (Admin only)
router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }

      await task.deleteOne();
      res.json({ message: "Task removed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
