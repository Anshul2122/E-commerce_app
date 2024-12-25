import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected!");
    } catch (e) {
        console.log("error connecting DB: ", e.message);
        process.exit(1);
    }
}

export default connectDB;