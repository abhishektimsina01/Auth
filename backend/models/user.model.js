import mongoose  from "mongoose";

const SignupSchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true,
        required : true
    },  
    gmail : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },

    isVerified : {
        type : Boolean,
        default : false
    },
    verificationToken : String,
    verificationTokenExpiresAt : Date,
    resetPasswordToken : String,
    resetPasswordTokenExpiresAt : Date,
    lastLoginTime : Date
},{
    versionKey : false,
    timestamps : true
})

const Signup = mongoose.model("signup", SignupSchema)

export {Signup}