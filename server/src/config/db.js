import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connectionInstace = await mongoose.connect(process.env.MONGODB_URI)
          .then((data) => {
            console.log(`Mongodb connected`);
          });
    } catch (error) {
        console.log("error: ",error);
        process.exit(1);
    }
}

export default connectDB;