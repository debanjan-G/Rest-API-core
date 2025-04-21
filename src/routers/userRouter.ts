import express, { Request, Response } from "express";
import User from "../models/User";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    profileDetails: req.user,
  });
});

router.delete("/", async (req: Request, res: Response) => {
  try {
    const googleUserID = req.user?.googleId;
    const deletedProfile = await User.findOneAndDelete({
      googleId: googleUserID,
    });

    if (!deletedProfile) {
      res.json({
        success: false,
        message:
          "Couldn't delete user. Please check server console for more details.",
      });
      return;
    }

    res.json({ success: true, deletedProfile });
  } catch (error) {
    console.log("Error occured while trying to delete account! ", error);
  }
});

export default router;
