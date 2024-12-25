import { TryCatch } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import redis from "../utils/redis.js";
import User from "../models/user.model.js";
import {ErrorHandler} from "../utils/ErrorHandler.js";


const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};


const signup = TryCatch(async (req, res,next) => {
    const {email, username, password, fullName} = req.body;
     if([fullName, email, username, password].some((field)=>field?.trim()==="")){
         return next(new ErrorHandler("All Fields are required"));
     }
    const exitedUser = await User.findOne({$or:[{username},{email}]});
    if(exitedUser){
       return next(new ErrorHandler("User with email or username exists"), 401);
    }
    const avatarLocalPath = req.files?.avatar?.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        return next(new ErrorHandler( "avatar is required", 400));
    }
    const user = await User.create({
        fullName,
        email,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    res.status(201).json({
        success:true, message:"Successfully created user",
        createdUser,
    });
})


const login = TryCatch(async (req, res,next) => {
    const {email, username, password} = req.body;
    if(!username && !email){
        return next(new ErrorHandler("Username or email is required", 400));
    }
    const user = await User.findOne({$or:[{username},{email}]});
    if(!user) return next(new ErrorHandler("User not found", 404));
    if (user && (await user.comparePassword(password))) {
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        res.status(201).json({
            success:true, message:"Successfully logged in",
            username: user.userName,
            email: user.email,
            role: user.role,
        });
    } else {
        return next(new ErrorHandler("Invalid credentials", 400));
    }
})


const logout = TryCatch(async (req, res,next) => {

        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({ success:true, message: "Logged out successfully" });
})


const refreshToken =  TryCatch(async (req, res,next) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return next(new ErrorHandler("No refresh token provided", 401));
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
         if (storedToken !== refreshToken) {
             return next(new ErrorHandler("Invalid refresh token", 401));
         }
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.status(200).json({ success:true, message: "Token refreshed successfully" });
});

// 409
const getProfile = TryCatch(async (req, res,next) => {
    const user = await User.findById(req.userId);
    if(!user) return next(new ErrorHandler( "user not found", 404));
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user,
    });
})


export {signup, login, logout, refreshToken, getProfile};