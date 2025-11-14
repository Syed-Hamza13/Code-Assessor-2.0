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


const teacherSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherName: { type: String, required: true },
  teacherId: { type: String, required: true, unique: true },
  teacherPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Teacher = mongoose.model("Teacher", teacherSchema);

export const User = mongoose.model("User", userSchema); 