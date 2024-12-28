
import jwt  from 'jsonwebtoken';
import asyncHandler from './../middleware/catchAsyncErrors.js';
import ErrorHandler from './../utils/errorHandler.js';
import User from "../models/user.model.js"

const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        //const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return refreshToken
    } catch (error) {
        console.log("error: ",error);
        return;
        
    }
}
const adminLogin = asyncHandler(async(req, res, next)=>{
    const {secret_key, email} = req.body;
    const admin = await User.findOne({email});

    if(!admin){
        return next(new ErrorHandler("Invalid email.", 401));
    } 
    if(admin.role !== "admin"){
        return next(new ErrorHandler("you are not admin", 401));
    }
    if(secret_key!==process.env.ADMIN_SECRET_KEY){
        return next(new ErrorHandler("Get Out! You're not authorized to access this route.", 401))
    }
    const refreshToken = await generateAccessTokenAndRefreshToken(admin._id);
    const token = jwt.sign(secret_key, process.env.JWT_SECRET);
    return res.status(200).cookie("admin_token", token).cookie("refreshToken", refreshToken).json({
        success: true,
        message: "welcome admin.",
        admin
    });
});

const adminLogout = asyncHandler(async(req, res, next)=>{
    const adminToken = req.cookies?.admin_token;
    const refreshToken = req.cookies?.refreshToken;
    if(!adminToken){
        return next(new ErrorHandler("No admin token found, login first", 401));
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $unset:{
            refreshToken:1,
        }
    })

    res.status(200).clearCookie(adminToken).json({
        success: true,
        message: "admin logged out successfully."
    });
});

const getAllUsers = asyncHandler(async(req, res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

const getSingleUser = asyncHandler(async(req, res, next)=>{
    const id = req.params.id;
    const user = await User.findById(id);

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user
    })
})

const updateUserRole = asyncHandler(async(req, res, next)=>{
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, {
        $set:{
            role:req.body.role
        }
    }, {new:true});

    res.status(200).json({
        message:`${user.name} is now ${user.role}`,
        success: true,
        user
    });
});

const deleteUser = asyncHandler(async(req, res, next)=>{
    const id = req.params.id;
    const user = await User.findById(id);

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }
    await user.deleteOne();

    res.status(200).json({
        message:`User account deleted`,
        success: true
    });
})


export {adminLogin, adminLogout, getAllUsers, deleteUser, updateUserRole, getSingleUser};