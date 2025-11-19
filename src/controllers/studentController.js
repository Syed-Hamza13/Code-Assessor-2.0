import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Student } from "../models/User.js";

// STUDENT LOGIN
export const loginStudent = async (req, res) => {
  try {
    const { enrollmentNo, password } = req.body;

    if (!enrollmentNo || !password) {
      return res.status(400).json({ message: "Enrollment no. and password required" });
    }

    // NOTE: yaha assume kar rahe hain ki ek hi college ke students is system me hain
    const student = await Student.findOne({ enrollmentNo });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: student._id,
        role: "student",
        enrollmentNo: student.enrollmentNo,
        collegeId: student.collegeId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      token,
      redirect: "/student/dashboard",
    });
  } catch (err) {
    console.error("Student login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
