
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js'
import connectToDatabase from './db/db.js'

connectToDatabase();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter)

app.listen(process.env.PORT, () => {
  console.log("Server is Running! Go chase it!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ Connection error:", err));
