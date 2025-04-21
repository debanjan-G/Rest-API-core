import mongoose, { Document } from "mongoose";
import { IUser } from "../types/express";

// Extend both IUser and Document
interface UserDocument extends IUser, Document {
  tasks: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<UserDocument>({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    default: [],
  },
  displayName: String,
  email: String,
  firstName: String,
  lastName: String,
  profilePicture: String,
});

export default mongoose.model<UserDocument>("User", userSchema);
