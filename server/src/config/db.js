import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connectionInstace = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
          })
          .then((data) => {
            console.log(`Mongodb connected with server: ${data.connection.host}`);
          });
    } catch (error) {
        console.log("error: ",e);
        process.exit(1);
    }
}

export default connectDB;