import express from "express";
import path from "path";

// import rootDir from "../utils/pathUtils.js";
import { signupCollege, loginCollege, logoutCollege } from "../controllers/authController.js";

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

authRouter.post("/college/signup", signupCollege);
authRouter.post("/college/login", loginCollege);
authRouter.post("/college/logout", logoutCollege);

// teacher auth routes
authRouter.get("/teacher/login", (req, res) => {
    res.sendFile(path.join(teacherPagesPath, "login.html"));
});

// student auth routes
authRouter.get("/student/login", (req, res) => {
  res.sendFile(path.join(studentPagesPath, "login.html"));
});

export { authRouter };


// import express from "express";
// import { signupCollege, loginCollege } from "../controllers/authController.js";

// const authRouter = express.Router();

// authRouter.post("/college/signup", signupCollege);
// authRouter.post("/college/login", loginCollege);

// export { authRouter };


