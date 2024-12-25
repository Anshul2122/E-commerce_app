import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit:"10mb"}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));




app.use((req, res, next) => {
    console.log(
        "----------------------------------------------------------------------------------"
    );
    console.log(`Route being hit: ${req.method} ${req.path}`);
    console.log("Req Body", req.body);
    console.log("Req Params", req.params);
    console.log("Req Query", req.query);
    console.log(
        "----------------------------------------------------------------------------------"
    );
    next();
});

//importing routes
import UserRoute from "./routes/user.route.js";

//routes

app.use("/api/auth", UserRoute);



export {app};