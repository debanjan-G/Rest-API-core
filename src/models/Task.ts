import mongoose, { Document } from "mongoose";

// Interface for Task document
interface ITask {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
}

interface TaskDocument extends ITask, Document {}

const taskSchema = new mongoose.Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<TaskDocument>("Task", taskSchema);
