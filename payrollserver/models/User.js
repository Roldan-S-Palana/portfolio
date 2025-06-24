import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], required: true },
  profileImage: { type: String }, // ← was profileImage
  position: { type: String }, // ← new
  department: { type: String }, // ← new
  createdAt: { type: Date, default: Date.now }, // ← typo fixed
  updatedAt: { type: Date, default: Date.now },
});

// Hide password in API responses
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
