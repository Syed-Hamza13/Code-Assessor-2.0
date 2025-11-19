import express from "express";
import path from "path";
import rootDir from "../utils/pathUtils.js";
import { verifyToken, requireRole } from "../middlewares/authMiddleware.js";

const teacherRouter = express.Router(); 

const teacherPagesPath = path.join(rootDir, "public/html/teacher/");

teacherRouter.get("/teacher/dashboard", verifyToken, requireRole("teacher"), (req, res) => {
  res.sendFile(path.join(teacherPagesPath, "teacherDashboard.html"));
});

teacherRouter.get("/teacher/assign", verifyToken, requireRole("teacher"), (req, res) => {
  res.sendFile(path.join(teacherPagesPath, "assign.html"));
});

teacherRouter.get("/teacher/see-analytics", verifyToken, requireRole("teacher"), (req, res) => {
  res.sendFile(path.join(teacherPagesPath, "analytics.html"));
});

export { teacherRouter };
export { teacherPagesPath };
