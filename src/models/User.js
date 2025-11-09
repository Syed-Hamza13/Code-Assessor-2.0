import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  collegeName: { type: String },
  collegeEmail: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  collegeCity: { type: String },
  collegeCode: { type: String },
  role: { type: String, enum: ["college", "teacher", "student"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema); 