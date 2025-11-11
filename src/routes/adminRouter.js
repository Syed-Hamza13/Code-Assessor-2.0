import express from "express";
import path from "path";
import rootDir from "../utils/pathUtils.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

import { createClass, getCollegeClasses } from "../controllers/adminController.js";

const adminRouter = express.Router();

const collegePagesPath = path.join(rootDir, "public/html/college/");

//unprotected route
// adminRouter.get("/college/dashboard", (req, res) => {
//   res.sendFile(path.join(collegePagesPath, "adminDashboard.html"));
// });

// Protected route: only logged-in colleges can access
adminRouter.get("/college/dashboard", verifyToken, (req, res) => {
  res.sendFile(path.join(collegePagesPath, "adminDashboard.html"));
});

// unprotected route
// adminRouter.get("/college/manage-class", (req, res) => {
//   res.sendFile(path.join(collegePagesPath, "class.html"));
// });

// protected rout only logged-in colleges can access 
adminRouter.get("/college/manage-class",verifyToken, (req, res) => {
  res.sendFile(path.join(collegePagesPath, "class.html"));
});

// get classess for a college and list classes for a college 
adminRouter.post("/college/create-class", createClass);
adminRouter.get("/college/classes", getCollegeClasses);

export { adminRouter };
export { collegePagesPath }; 



// import express from "express";
// import path from "path";
// import rootDir from "../utils/pathUtils.js";
// import { verifyToken } from "../middlewares/authMiddleware.js";

// const adminRouter = express.Router();
// const collegePagesPath = path.join(rootDir, "public/html/college/");

// // Protected route: only logged-in colleges can access
// adminRouter.get("/college/dashboard", verifyToken, (req, res) => {
//   res.sendFile(path.join(collegePagesPath, "adminDashboard.html"));
// });

// adminRouter.get("/college/manage-class", verifyToken, (req, res) => {
//   res.sendFile(path.join(collegePagesPath, "class.html"));
// });

// export { adminRouter };
// export { collegePagesPath };

