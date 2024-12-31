import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import Stripe from 'stripe';


const app = express();

if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: './.env' });
}

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

export const stripe = new Stripe(process.env.STRIPE_API_KEY);

app.use((req, res, next) => {
    console.log(
      "----------------------------------------------------------------------------------"
    );
    console.log(`Route being hit: ${req.method} ${req.path}`);
    console.log("Req Body", req?.body);
    console.log("Req Params", req.params);
    console.log("Req Query", req.query);
    console.log(
      "----------------------------------------------------------------------------------"
    );
    next();
  });


import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";


app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);



export default app;