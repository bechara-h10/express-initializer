import type { NextFunction, Request, Response } from "express";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import apiRouter from "./routes/api";
import { CustomError } from "./types/error";

// Create express app
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "public")));

// using routers
app.use("/api", apiRouter);

// catch 404 and forware to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.use(function (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
