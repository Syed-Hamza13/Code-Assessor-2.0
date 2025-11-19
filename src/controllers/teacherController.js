import jwt from "jsonwebtoken";
import { Teacher } from "../models/User.js";

// TEACHER LOGIN
export const loginTeacher = async (req, res) => {
  try {
    const { teacherId, password } = req.body;

    if (!teacherId || !password) {
      return res.status(400).json({ message: "Teacher ID and password required" });
    }

    const teacher = await Teacher.findOne({ teacherId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // ⚠️ Abhi teacherPassword plain text me store ho raha hai
    // agar hash karna chahte ho to addTeacher me bcrypt.hash lagana padega
    if (password !== teacher.teacherPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: teacher._id,
        role: "teacher",
        teacherId: teacher.teacherId,
        collegeId: teacher.collegeId,
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
      redirect: "/teacher/dashboard",
    });
  } catch (err) {
    console.error("Teacher login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
