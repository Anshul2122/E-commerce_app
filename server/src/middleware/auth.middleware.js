import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "./catchAsyncErrors.js";
import jwt from 'jsonwebtoken';

const adminOnly =  asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user); 
    if(!user){
        return next(new ErrorHandler("invalid id", 401));
    }
    if(user.role!=="admin"){
        return next(new ErrorHandler("you are not allowed to access these resouces", 403));
    }
    next();
});

const isAuthenticatedUser = asyncHandler(async(req, res, next)=>{
    try{
        const refreshToken = req.cookies.refreshToken;
        const decodedData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user =  await User.findById(decodedData?._id).select("-password -refrestToken");
        if(!user){
            return next(new ErrorHandler("invalid token, please login again", 401));
        }
        req.user = user;
        next();
    } catch(error){
        console.log("error: ", error);
        return next(new ErrorHandler("invalid refresh token, please login again", 401));   
    }
});





export {adminOnly, isAuthenticatedUser}