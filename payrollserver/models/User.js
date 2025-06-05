import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, enum: ["admin","employee"], required: true},
  profileImage: {type: String},
  createAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

// ✅ This hides the password when converting documents to JSON (e.g., API response)
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});


const User = mongoose.model("User", userSchema
  )
export default User
