import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';


const app = express();

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


export default app;