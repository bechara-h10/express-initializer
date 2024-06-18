import type { Request, Response } from "express";

const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello from API route with Typescript!");
});

export default apiRouter;
