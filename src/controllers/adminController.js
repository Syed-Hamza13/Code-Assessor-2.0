import { Class } from "../models/Class.js";
import { Teacher } from "../models/User.js";
import jwt from "jsonwebtoken";
import { Student } from "../models/User.js";
import bcrypt from "bcryptjs";
import XLSX from "xlsx";
import ExcelJS from "exceljs";
import fs from "fs";


// create class controller
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

    res
      .status(201)
      .json({ message: "Class created successfully", classData: newClass });
  } catch (err) {
    console.error("Class creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get class for a college controller
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

// add teacher controller
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

    res
      .status(201)
      .json({ message: "Teacher added successfully", teacher: newTeacher });
  } catch (err) {
    console.error("Add teacher error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get teachers controller
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

// add student controllet
export const addStudent = async (req, res) => {
  try {
    const collegeId = req.user.id; // from verifyToken
    const { studentName, enrollmentNo, semester, branch, year } = req.body;

    if (!studentName || !enrollmentNo || !semester || !branch || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Student.findOne({ collegeId, enrollmentNo });
    if (exists) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(enrollmentNo, 10);

    const newStudent = await Student.create({
      collegeId,
      studentName,
      enrollmentNo,
      semester,
      branch,
      year,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Student added successfully",
      student: newStudent,
    });
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get students controller
export const getStudents = async (req, res) => {
  try {
    const collegeId = req.user.id;
    const students = await Student.find({ collegeId });
    res.status(200).json(students);
  } catch (err) {
    console.error("Get students error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// add students via excel controller


export const addStudentExcel = async (req, res) => {
  try {
    const collegeId = req.user.id;

    // ---------------- FILE CHECK ----------------
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileExt = req.file.originalname.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(fileExt)) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "Invalid file type. Upload .xlsx or .xls only." });
    }

    // ---------------- PARSE EXCEL ----------------
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    // REQUIRED COLUMNS
    const requiredCols = ["studentName", "enrollmentNo", "semester", "branch"];
    const errors = [];
    const validStudents = [];

    const semToYear = {
      1: "1",
      2: "1",
      3: "2",
      4: "2",
      5: "3",
      6: "3",
      7: "4",
      8: "4",
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let missing = [];

      requiredCols.forEach((col) => {
        if (!row[col]) missing.push(col);
      });

      if (!semToYear[row.semester]) {
        missing.push("Invalid Semester");
      }

      // Skip if missing
      if (missing.length > 0) {
        errors.push({
          ...row,
          error: `Missing/Invalid: ${missing.join(", ")}`,
        });
        continue;
      }

      const exists = await Student.findOne({
        collegeId,
        enrollmentNo: row.enrollmentNo,
      });
      if (exists) {
        errors.push({
          ...row,
          error: "Enrollment already exists",
        });
        continue;
      }

      validStudents.push({
        collegeId,
        studentName: row.studentName,
        enrollmentNo: row.enrollmentNo,
        semester: row.semester,
        branch: row.branch,
        year: semToYear[row.semester],
        password: await bcrypt.hash(row.enrollmentNo, 10),
      });
    }

    // DELETE THE FILE FROM SERVER
    fs.unlinkSync(req.file.path);

    // ---------------- INSERT VALID STUDENTS ----------------
    if (validStudents.length > 0) {
      await Student.insertMany(validStudents);
    }

    // ---------------- RETURN ERROR EXCEL IF ANY ----------------
    if (errors.length > 0) {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Errors");

      sheet.addRow([
        "studentName",
        "enrollmentNo",
        "semester",
        "branch",
        "error",
      ]);

      errors.forEach((e) => {
        sheet.addRow([
          e.studentName || "",
          e.enrollmentNo || "",
          e.semester || "",
          e.branch || "",
          e.error,
        ]);
      });

      const errorFilePath = `uploads/error_students_${Date.now()}.xlsx`;
      await workbook.xlsx.writeFile(errorFilePath);

      return res.status(207).json({
        message: "Some students were not added",
        added: validStudents.length,
        failed: errors.length,
        errorFile: errorFilePath,
      });
    }

    // ALL OK
    return res.status(200).json({
      message: "All students added successfully",
      added: validStudents.length,
    });
  } catch (err) {
    console.error("Excel student add error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
