import ErrorHandler from './../utils/errorHandler.js';
import asyncHandler from './../middleware/catchAsyncErrors.js';
import User from './../models/user.model.js';
import {uploadOnCloudinary } from "../config/cloudinary.js"


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


const registerUser = asyncHandler(async(req, res, next) => {
    const { name, email, password, gender, dob, role, phoneNumber } = req.body;
    const existedUser = await User.findOne({ email, phoneNumber });
    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: `user with ${email} or  phone number ${phoneNumber}  already exists or, try to login`,
      });
    }
    const avatarLocalPath = req.file.path;
    const results = await uploadOnCloudinary(avatarLocalPath)
    if(!results){
        return next(new ErrorHandler( "error in upload on cloudinary", 500));
    }
    const avatar=results.url;
    if([name, email, password, gender, dob, phoneNumber].some((field)=>field?.trim()==="")){
        return next(new ErrorHandler( "all fields are required", 400));
    }
    

    const user =  await User.create({
        name,
        email,
        password,
        phoneNumber,
        gender,
        dob,
        avatar,
        role,
    });

    return res.status(201).json({
        success: true,
        message:`welcone, ${user.name}`,
        user
    })
});


const loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("All fields are required", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid credentials", 401));
    }
    const isPasswordValid =  await user.comparepassword(password);
    if(!isPasswordValid){
        return next(new ErrorHandler("incorrect password", 401));
    }
    const refreshToken = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser =  await User.findById(user._id).select("-password -refreshToken");
    const options={
        httpOnly: true,
        secure: true,
    }

    return res.status(200).cookie("refreshToken",refreshToken)
    .json({ success: true, message: "User logged in successfully!! " , user:loggedInUser,refreshToken:refreshToken});
});


const logoutUser = asyncHandler(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $unset:{
            refreshToken:1
        }
    },
    {
        new:true,
    }
);
    const options={
        httpOnly: true,
        secure: true,
    }
    return res.status(200).clearCookie("refreshToken").json({message:"user logged out", success:true}) 
});

const getUserDetails = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user._id);

    return res.status(200).json({success: true, user});
});

const updateProfile =  asyncHandler(async(req, res, next) => {
    const {name, email, gender, dob} = req.body;
    if(!name){
        name = req.user.name;
    }
    if(!email){
        email = req.user.email;
    }
    if(!gender){
        gender = req.user.gender;
    }
    if(!dob){
        dob = req.user.dob;
    }
    if(!req.file.path){
        avatar = req.user.avatar;
    }
    if(req.file.path){
        const results = await uploadOnCloudinary(req.file.path)
        if(!results){
            return next(new ErrorHandler( "error in upload on cloudinary", 500));
        }
        avatar=results.url;
    }
    if(avatar===null){
        avatar = req.user.avatar;
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set:{
            name:name,
            email:email,
            avatar:avatar,
            gender:gender, 
            dob:dob,
        }
    }, {new :true}.select("-password"));

    return res.status(200).json({success:true, message:"profile updated!", user})
});

const updatepassword = asyncHandler(async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    const isPasswordCorrect = user.comparepassword(oldPassword);
    if(!isPasswordCorrect) {
        return next(new ErrorHandler("inncorrect old password", 401));
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json({success:true, message:"password changed"});
})



export {registerUser, loginUser, logoutUser, getUserDetails, updateProfile, updatepassword};
