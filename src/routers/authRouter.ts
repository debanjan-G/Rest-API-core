import express, { Request, Response } from "express";
import passport from "passport";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// redirect callback url
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/user",
    failureRedirect: "/",
  })
);

// logout route
router.get("/logout", isAuthenticated, (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.log("LOGOUT ERROR: ", err);
      res.send("error while logging out");
    }
    res.send("Logout successful!");
  });
});

export default router;
