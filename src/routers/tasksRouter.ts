import express from "express";

import {
  createNewTask,
  getTasks,
  deleteTask,
  updateTask,
} from "../controllers/tasksControllers";

const router = express.Router();

// get all tasks of logged in user
router.get("/", getTasks);

// Workaround for TypeScript error - ignore type checking for this part
// @ts-ignore
router.post("/", createNewTask);

// delete task
router.delete("/:taskID", deleteTask);

// update task
router.put("/:taskID", updateTask);

export default router;
