import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path: "./.env"});


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar:{
        type: String, // cloudinary url
        required: true,
    },
    refreshToken:{
        type: String,
    },
    cartItems:[
        {
            quantity:{
                type: Number,
                default: 1
            },
            products:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
            }
        }
    ],
    role:{
        type: String,
        enum: ['admin', 'customer', 'moderator'],
        default: 'customer',
    }
}, { timestamps: true });

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

// UserSchema.methods.generateAccessToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             username: this.username,
//             fullName: this.fullName
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }

// UserSchema.methods.generateRefreshToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

const User = mongoose.model("User", UserSchema);

export default User;