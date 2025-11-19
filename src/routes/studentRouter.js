import express from "express";
import path from "path";
import rootDir from "../utils/pathUtils.js";
import { verifyToken, requireRole } from "../middlewares/authMiddleware.js";
 
const studentRouter = express.Router(); 

const studentPagesPath = path.join(rootDir, "public/html/student/");

studentRouter.get("/student/dashboard", verifyToken, requireRole("student"), (req, res) => {
  res.sendFile(path.join(studentPagesPath, "studentDashboard.html"));
});

studentRouter.get("/student/see-analytics", verifyToken, requireRole("student"), (req, res) => {
  res.sendFile(path.join(studentPagesPath, "analytics.html"));
}); 

export { studentRouter };
export { studentPagesPath };
