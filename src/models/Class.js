import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  semester: { type: Number, required: true },
  year: { type: String, required: true },
  subject: { type: String, required: true },
  branch: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
   
export const Class = mongoose.model("Class", classSchema);
