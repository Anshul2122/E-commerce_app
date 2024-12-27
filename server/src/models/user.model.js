import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "please enter your name"],
            unique: true,
            lowercase:true
        },
        email:{
            type: String,
            required: [true, "please enter your email"],
            unique: true,
            lowercase:true,
            validate:[validator.isEmail, "please enter valid email"],
            trim: true,
        },
        password:{
            type: String,
            required: [true, 'Password is required'],
            minLength:[8, "password must be at least 8 characters"],
            select:false,
        },
        avatar:{
            type: String,
            required: true
        },
        role:{
            type:String,
            default: 'user',
            enum:['user', 'admin'],
            
        },
        gender:{
            type:String,
            enum:['male', 'female'],
            required: [true, "Please enter Gender"],
        },
        dob:{
            type:String,
            required: [true, 'Date of birth is required']
        },
        resetPasswordToken:{
            type:String,
            required:false
        },
        resetPasswordExpires:{
            type:Date,
            required:false
        },
    },
    {timestamps:true}
);

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.getJWTtoken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN
    })
};

UserSchema.methods.comparepassword = async function(password) {
    return await bcrypt.compare(password, this.password);    
};

UserSchema.methods.getResetpasswordToken = function(){
    const resetToken = jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '15m' } // 15 minutes
    );
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
}

UserSchema.methods.verifyResetToken = function(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        return decoded.userId.toString() === this._id.toString();
    } catch (error) {
        return false;
    }
}

const User = mongoose.model("User", UserSchema);
export default User;