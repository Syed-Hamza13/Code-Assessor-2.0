import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const signupCollege = async (req, res) => {
  try {
    const { collegeName, collegeEmail, password, retypePassword, collegeCity, collegeCode } = req.body;

    if (password !== retypePassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existing = await User.findOne({ collegeEmail });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newCollege = await User.create({
      collegeName,
      collegeEmail,
      password: hashed,
      collegeCity,
      collegeCode,
      role: "college",
    });

    // res.status(201).json({ message: "Signup successful", user: newCollege });
    res.status(201).json({ message: "Signup successful", redirect: "/college/login", user: newCollege});

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginCollege = async (req, res) => {
  try {
    const { collegeEmail, password } = req.body;
    const user = await User.findOne({ collegeEmail, role: "college" });

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.collegeEmail, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send JWT in cookie (optional but safer)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      token,
      redirect: "/college/dashboard"
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutCollege = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, 
        sameSite: "lax"
    });
    res.status(200).json({message: "Logout successful", redirect: "/college/login"});
}

