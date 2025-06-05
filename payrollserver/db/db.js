import mongoose from 'mongoose'

const connectToDatabase = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connected to MongoDB Atlas");
  }catch(e){
    console.error("❌ Connection error:", e)
  }
}

export default connectToDatabase