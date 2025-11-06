import express from "express";
import path from "path";
import rootDir from "../utils/pathUtils.js";

import { studentPagesPath} from "./studentRouter.js";
import { collegePagesPath} from "./adminRouter.js";
import { teacherPagesPath} from "./teacherRouter.js";
const authRouter = express.Router(); 


// college auth routes 
authRouter.get("/college/signup", (req, res) => {
  res.sendFile(path.join(collegePagesPath, "signup.html"));
});

authRouter.get("/college/login", (req, res) => {
  res.sendFile(path.join(collegePagesPath, "login.html"));
});

// teacher auth routes
authRouter.get("/teacher/login", (req, res) => {
    res.sendFile(path.join(teacherPagesPath, "login.html"));
});

// student auth routes
authRouter.get("/student/login", (req, res) => {
  res.sendFile(path.join(studentPagesPath, "login.html"));
});

export { authRouter };
