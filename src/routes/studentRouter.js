import express from "express";
import path from "path";
import rootDir from "../utils/pathUtils.js";

const studentRouter = express.Router(); 

const studentPagesPath = path.join(rootDir, "public/html/student/");

studentRouter.get("/student/dashboard", (req, res) => {
  res.sendFile(path.join(studentPagesPath, "studentDashboard.html"));
});

studentRouter.get("/student/see-analytics", (req, res) => {
  res.sendFile(path.join(studentPagesPath, "analytics.html"));
});


export { studentRouter };
export { studentPagesPath };

