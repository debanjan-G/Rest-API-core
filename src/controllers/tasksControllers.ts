import { Request, Response } from "express";
import User from "../models/User";
import Task from "../models/Task";
import { ObjectId, Types } from "mongoose";

const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();

    if (tasks.length === 0) {
      res.json({
        success: true,
        message: `No task has yet been created by ${req.user?.firstName}`,
      });
      return;
    }

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.json({
      success: false,
      message: "An error occured while trying to fetch tasks",
    });
    console.log("Get all tasks error: ", error);
  }
};

const createNewTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    const loggedInUser = await User.findOne({
      googleId: req.user?.googleId,
    });

    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // add new task to Task collections
    const newTask = await Task.create({
      title,
      description,
      createdBy: loggedInUser._id,
    });

    // Update user's tasks array with proper typing
    const taskId = newTask._id as Types.ObjectId;
    loggedInUser.tasks = [...(loggedInUser.tasks as Types.ObjectId[]), taskId];
    await loggedInUser.save();

    res.json({
      success: true,
      message: "New Task created successfully!",
      newTask,
      user: loggedInUser,
    });
  } catch (error) {
    console.log("New task error: ", error);
    res.json({
      success: false,
      message: "An error occured while creating the task!",
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskID = req.params.taskID;

    // Find the current user
    const currentUser = await User.findOne({
      googleId: req.user?.googleId,
    });

    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Remove task from the user's tasks array
    currentUser.tasks = currentUser.tasks.filter(
      (task) => task.toString() !== taskID
    );

    // Save the updated user
    await currentUser.save();

    // Delete the task
    const deletedTask = await Task.findByIdAndDelete(taskID);

    if (!deletedTask) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
      deletedTask,
    });
  } catch (error) {
    console.log("Error while deleting the task: ", error);
    res.json({
      success: false,
      message: "An error occurred while deleting the task",
    });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const taskID = req.params.taskID;
    const { title, description } = req.body;

    const updateFields: Partial<{ title: string; description: string }> = {};

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;

    const updatedTask = await Task.findByIdAndUpdate(
      taskID,
      {
        $set: updateFields,
      },
      {
        new: true,
      }
    );

    if (!updatedTask) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Task successfully updated",
      updatedTask,
    });
  } catch (error) {
    console.log("Error while updating the task: ", error);
    res.json({
      success: false,
      message: "An error occured while updating the task",
    });
  }
};

export { getTasks, createNewTask, deleteTask, updateTask };
