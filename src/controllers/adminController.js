import { Class } from "../models/Class.js";
import { Teacher } from "../models/User.js";
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



export const addTeacher = async (req, res) => {
  try {
    // collegeId directly req.user se lo (verifyToken middleware set karta hai)
    const collegeId = req.user.id;
    const { teacherName, teacherId, teacherPassword } = req.body;

    if (!teacherName || !teacherId || !teacherPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if teacher already exists
    const exists = await Teacher.findOne({ collegeId, teacherId });
    if (exists) {
      return res.status(409).json({ message: "Teacher ID already exists" });
    }

    const newTeacher = await Teacher.create({
      collegeId,
      teacherName,
      teacherId,
      teacherPassword,
    });

    res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher });
  } catch (err) {
    console.error("Add teacher error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const collegeId = req.user.id;

    const teachers = await Teacher.find({ collegeId });
    res.status(200).json(teachers);
  } catch (err) {
    console.error("Get teachers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
