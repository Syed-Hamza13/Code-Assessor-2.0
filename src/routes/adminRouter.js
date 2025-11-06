import express from "express";
import path from "path";
import rootDir from "../utils/pathUtils.js";

const adminRouter = express.Router();

const collegePagesPath = path.join(rootDir, "public/html/college/");

adminRouter.get("/college/dashboard", (req, res) => {
  res.sendFile(path.join(collegePagesPath, "adminDashboard.html"));
});
adminRouter.get("/college/manage-class", (req, res) => {
  res.sendFile(path.join(collegePagesPath, "class.html"));
});

export { adminRouter };
export { collegePagesPath };


