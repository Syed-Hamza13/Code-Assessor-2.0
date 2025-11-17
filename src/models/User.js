import mongoose from "mongoose";

// college model schema 
const userSchema = new mongoose.Schema({
  collegeName: { type: String },
  collegeEmail: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  collegeCity: { type: String },
  collegeCode: { type: String },
  role: { type: String, enum: ["college", "teacher", "student"], required: true },
  createdAt: { type: Date, default: Date.now },
});

// teacher model schema
const teacherSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherName: { type: String, required: true },
  teacherId: { type: String, required: true, unique: true },
  teacherPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// student model schema 
const studentSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  enrollmentNo: { type: String, required: true }, 
  semester: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// export college model 
export const User = mongoose.model("User", userSchema); 

// export teacher model
export const Teacher = mongoose.model("Teacher", teacherSchema);

// export student model 
export const Student = mongoose.model("Student", studentSchema);