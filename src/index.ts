import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter";
import userRouter from "./routers/userRouter";
import tasksRouter from "./routers/tasksRouter";
import "./auth"; // Import passport configuration
import connectDB from "./utils/connectDB";
import isAuthenticated from "./middlewares/isAuthenticated";
import MongoStore = require("connect-mongo");

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
connectDB();

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60 * 24 * 7, // = 7 days session expiry
      autoRemove: "native", // cleans up expired sessions
    }),
  })
);

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req: Request, res: Response): void => {
  if (req.user) {
    res.redirect("/dashboard");
    return;
  }

  res.send("<a href='/auth/google'>Login with Google</a>");
});

// Auth and Dashboard routes
app.use("/auth", authRouter);

// User routes
app.use("/user", isAuthenticated, userRouter);

// Task routes
app.use("/tasks", isAuthenticated, tasksRouter);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

const PORT = process.env.PORT || 3000;

// Add more detailed server start logging
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
