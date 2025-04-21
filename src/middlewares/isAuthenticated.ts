import { NextFunction, Request, Response } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  req.user
    ? next()
    : res.status(401).send("Please log in to access the dashboard");
};

export default isAuthenticated;
