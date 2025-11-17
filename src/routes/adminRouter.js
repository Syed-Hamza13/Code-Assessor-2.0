import express from "express";
import path from "path";
import rootDir from "../utils/pathUtils.js";
import multer from "multer";
import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  createClass,
  getCollegeClasses,
  addTeacher,
  getTeachers,
  addStudent,
  getStudents,
  addStudentExcel
} from "../controllers/adminController.js";

const adminRouter = express.Router(); 

const collegePagesPath = path.join(rootDir, "public/html/college/");

const upload = multer({ dest: "uploads/" });


// Protected route: only logged-in colleges can access
adminRouter.get("/college/dashboard", verifyToken, (req, res) => {
  res.sendFile(path.join(collegePagesPath, "adminDashboard.html"));
});



// protected rout only logged-in colleges can access
adminRouter.get("/college/manage-class", verifyToken, (req, res) => {
  res.sendFile(path.join(collegePagesPath, "class.html"));
});

// get classess for a college and list classes for a college
adminRouter.post("/college/create-class", verifyToken, createClass);
adminRouter.get("/college/classes", verifyToken, getCollegeClasses);

//adding teachers
adminRouter.post("/college/add-teacher", verifyToken, addTeacher);
adminRouter.get("/college/teachers", verifyToken, getTeachers);


adminRouter.post(
  "/college/add-student-excel",
  verifyToken,
  upload.single("excelFile"),
  addStudentExcel
);

adminRouter.post("/college/add-student", verifyToken, addStudent);
adminRouter.get("/college/students", verifyToken, getStudents);

// Move exports to bottom so all routes are registered
export { adminRouter };
export { collegePagesPath };

