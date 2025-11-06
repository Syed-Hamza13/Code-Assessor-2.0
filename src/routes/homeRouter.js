import express from "express";
import path from "path";
import rootDir from "../utils/pathUtils.js";

const homePagesPath = path.join(rootDir, "public/html/");

const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.sendFile(path.join(homePagesPath, "index.html"));
});

export { homeRouter };
