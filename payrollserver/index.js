
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js'
import connectToDatabase from './db/db.js'
import departmentRouter from './routes/department.js'

connectToDatabase();
const app = express();

//app.use(cors());
app.use(cors({
  origin: "http://localhost:5173", // allow Vite frontend
  credentials: true // allow cookies / auth headers
}));

app.use(express.json());
app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)

app.listen(process.env.PORT, () => {
  console.log("Server is Running! Go chase it!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ Connection error:", err));
