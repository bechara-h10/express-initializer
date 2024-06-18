const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send("Hello from API route!");
});

module.exports = apiRouter;
