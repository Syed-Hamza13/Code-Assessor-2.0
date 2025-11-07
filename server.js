import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// import database connection 
import { connectDB } from "./src/config/db.js"
// Import Routers 
import { homeRouter } from "./src/routes/homeRouter.js";
import { adminRouter } from "./src/routes/adminRouter.js";
import { authRouter } from "./src/routes/authRouter.js";
import { teacherRouter } from "./src/routes/teacherRouter.js"; 
import { studentRouter } from "./src/routes/studentRouter.js";

import dotenv from "dotenv"; // import dotenv for environment variables 
dotenv.config(); // Load environment variables

const app = express();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//connect to database 
connectDB()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// use routers
app.use(homeRouter);
app.use(authRouter);
app.use(adminRouter);
app.use(teacherRouter);
app.use(studentRouter);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'

app.listen(PORT,HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
  