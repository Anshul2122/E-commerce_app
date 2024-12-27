
import app from "./app.js";
import connectDB from './config/db.js';


if(process.env.NODE_ENV === 'production'){
    require("dotenv".config)({path:"config/config.env"});
}

//handling uncaught exceptions
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err}`);
    console.log(`shutting down server due to uncaught exception`);
    process.exit(1);
});

connectDB();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is working on port: ${process.env.PORT}`);
});

//  unhandled promise rejection
process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    
    server.close(()=>{
        process.exit(1);
    });
});





