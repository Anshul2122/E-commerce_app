import ErrorHandler from './../utils/errorHandler.js';
import asyncHandler from './../middleware/catchAsyncErrors.js';
import User from './../models/user.model.js';
import {uploadOnCloudinary } from "../config/cloudinary.js"


const registerUser = asyncHandler(async(req, res, next) => {
    const {name, email, password,gender, dob } = req.body;
    const avatarLocalPath = req.file.path;
    const results = await uploadOnCloudinary(avatarLocalPath)
    if(!results){
        return next(new ErrorHandler( "error in upload on cloudinary", 500));
    }
    const avatar=results.url;
    if([name, email, password, gender, dob].some((field)=>field?.trim()==="")){
        return next(new ErrorHandler( "all fields are required", 400));
    }
    const date = dob.split("T")[0];
    // console.log("dob",dob);
    
    // console.log("dob splited",dob.split("T")[0]);
    const existedUser = await User.findOne({email});
    if(existedUser){
        return res.status(200).json({
            success:true,
            message:`welcome, ${existedUser.name}`
        });
    }

    const user =  await User.create({
        name,
        email,
        password,
        gender,
        dob:date,
        avatar,
    });

    return res.status(201).json({
        success: true,
        message:`welcone, ${user.name}`,
        user
    })
});



export {registerUser};