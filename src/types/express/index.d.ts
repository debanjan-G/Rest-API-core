import { Document } from "mongoose";

// Define the User interface that matches our MongoDB User model
interface IUser {
  googleId: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

// Extend Express's Request type
declare global {
  namespace Express {
    // This tells Express that the user property will have our IUser interface
    interface User extends IUser {}
  }
}

export { IUser };
