import { Class } from "../models/Class.js";
import jwt from "jsonwebtoken";

export const createClass = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const collegeId = decoded.id;

    const { semester, year, subject, branch } = req.body;

    const newClass = await Class.create({
      collegeId,
      semester,
      year,
      subject,
      branch,
    });

    res.status(201).json({ message: "Class created successfully", classData: newClass });
  } catch (err) {
    console.error("Class creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCollegeClasses = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const collegeId = decoded.id;

    const classes = await Class.find({ collegeId });
    res.status(200).json(classes);
  } catch (err) {
    console.error("Class fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
