import bcrypt, { compareSync } from "bcryptjs"
import { Signup } from "../models/user.model.js"
import { generateVerificationToken } from "../utils/generateVerificationToken.js"
import { AuthenticationToken } from "../utils/AuthenticationToken.js"
import {setCookie} from "../utils/setCookie.js"
import {removeAuthTokenCookie, removeResetTokenCookie} from "../utils/removeCookie.js"
import { verifyAuthenticationToken, verifyResetPasswordToken } from "../utils/verifyAuthenticationToken.js"
import { set } from "mongoose"

const gethome = (req,res) =>{
    res.json({
        message : "you are in the home page"
    })
}   

const SignUpUser = async(req, res, next)=>{
    try{
        const {name, gmail, password} = req.body
        const isUser = await Signup.findOne({name})
        if(!name || !gmail || !password){
            const err = new Error("fill up all the data")
            err.status = 400
            throw err
        }
        if(isUser){
            const err = new Error("User already exist")
            err.status = 400;
            throw err;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationToken()
        const verificationTokenExpiresAt = Date.now() + (24 * 60 * 60 * 1000)
        const user = await Signup.create({
            name,
            gmail,
            password : hashedPassword,
            verificationToken : verificationCode,
            verificationTokenExpiresAt
        })
        const token = AuthenticationToken(user._id)
        setCookie(res,"token",token)
        res.json({  
            user,
            token,
            message : `${verificationCode} token`,
            currentTime : `${new Date()}`,
            expireTime :`${new Date(verificationTokenExpiresAt)}` 
        })
    }
    catch(err){
        next(err)
    }
}

const passwordCheck = async(req,res,next) =>{
    try{
        const {name, password} = req.body
        if(!name || !password){
            const err = new Error("please fill up all the credentials")
            err.status = 400
            throw err
        }
        const user = await Signup.findOne({name})
        console.log(user)

        if(!user){
            const err = new Error("user is not registered")
            err.status = 400
            throw err
        }
        const isSame = await bcrypt.compare(password, user.password)
        if(!isSame){
            const err = new Error("fill correct credenials")
            err.status = 400
            throw err
        }
        req.user = {name, password}
        next()
        
    }
    catch(err){
        next(err)   
    }
}

const LogInUser = async(req,res,next) => {
    try{
        const token = AuthenticationToken(req.user._id)
        setCookie(res,"token", token)
        res.json({
            message : "You are logged in"
        })
    }
    catch(err){
        next(err)
    }
}


const isExpired = async (req,res, next) =>{
    try{
        const {userId} = verifyAuthenticationToken(req)
        const user = await Signup.findOne({_id : userId})
        if(user.isVerified == true){
            res.json({
                message : "you are already verified"
            })
        }
        const {verificationToken} = req.body
        const currentDate = Date.now()
        if(verificationToken != user.verificationToken){
            const err = new Error("wrong verification code")
            err.status = 400
            throw err
        }
        if(currentDate > user.verificationTokenExpiresAt.getTime()){
            let message = `your token ${user.verificationToken} has been expired`
            res.json({
                message
            })
        }
        else{
            await Signup.updateOne({_id : userId},{
                isVerified : true,
                //unset is used to remove the property from that documented that matches the condition
                $unset : {
                verificationToken : "",
                verificationTokenExpiresAt : ""
            }})
            let message = `you are verified`
            res.json({
                message,
            })
        }
    }
    catch(err){
        next(err)
    }
} 

const profile = async(req,res,next) =>{
    try{
        const {userId} = verifyAuthenticationToken(req)
        console.log(userId)
        const user = await Signup.findOne({_id : userId})
        if(!user){
            const err = new Error("no user found")
            err.status = 404
            throw err
        }
        if(user.isVerified == false){
            const err = new Error("Verify your account first")
            err.status = 404
            throw err
        }
        res.json({
            user
        })
    }
    catch(err){
        next(err)
    }
}

const updateUser = async(req,res,next) =>{
    try{
        const {userId} = verifyAuthenticationToken(req)
        const {newName, newPassword} = req.body
        const user = await Signup.findOne({_id : userId})
        const name = newName || user.name
        const password = newPassword || user.password
        const hashedPassword = await bcrypt.hash(password, 10)
        await Signup.updateOne({_id : userId},
            {
                name,
                password : hashedPassword
            }
        )
        const user1 = await Signup.findOne({_id : userId})
        res.json({
            message : "updated",
            user1
        })
    }
    catch(err){
        next(err)
    }
}

const logoutUser = async(req,res,next) => {
    try{
        removeAuthTokenCookie(res)
        console.log("logout")
        res.json({
            message : "logout"
        })
    }
    catch(err){
        next(err)
    }
}

const delUser = async(req,res,next) =>{
    try{
        await Signup.deleteMany({createdAt : {$gt : new Date(0)}})
        const users = await Signup.find({})
        console.log(users)
        res.json({  
            message : "deleted all the user"
        })
    }
    catch(err){
        next(err)
    }
}

const forgetPassword = async(req,res,next) => {
    try{
        const {name, gmail} = req.body
        if(!name || !gmail){
            const err = new Error("fill up all the credentials")
            err.status = 400
            throw err
        }
        const user = await Signup.findOne({name, gmail})
        console.log(user)
        if(!user){
            const err = new Error("no user registered")
            err.status = 400
            throw err
        }
        const resetPasswordToken = generateVerificationToken()
        const token = AuthenticationToken(user._id)
        setCookie(res, "resetToken", token)
        await Signup.updateOne({name},{
            resetPasswordToken,
            resetPasswordTokenExpiresAt : Date.now() + 24 * 60* 60* 1000
        })
        res.json({
            message : "Check your gmail",
            resetPasswordToken
        })
    }
    catch(err){
        next(err)
    }
    
}

const resetPassword = async(req,res,next) =>{
    try{
        const {resetPasswordToken, resetPassword} = req.body
        const {userId} = verifyResetPasswordToken(req)
        const user = await Signup.findOne({_id : userId})
        if(resetPasswordToken != user.resetPasswordToken && Date.now() > user.resetPasswordTokenExpiresAt.getTime()){
            const err = new Error("Sorry, something is wrong with token")
            err.status = 400
            throw err
        }
        const hashedPassword = await bcrypt.hash(resetPassword, 10)
        await Signup.updateOne({_id : userId},
            {
                password : hashedPassword,
                $unset : {
                    resetPasswordToken : "",
                    resetPasswordTokenExpiresAt : ""
                }
            })
        removeResetTokenCookie(res)
        res.json({
            resetPassword
        })
    }
    catch(err){
        next(err)
    }
}

export {gethome, SignUpUser, passwordCheck,LogInUser, logoutUser, isExpired, profile, updateUser, delUser, forgetPassword, resetPassword}