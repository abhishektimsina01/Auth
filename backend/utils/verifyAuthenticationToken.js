import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const verifyAuthenticationToken = (req) =>{
    try{
        const {token} = req.cookies
        const user = jwt.verify(token, process.env.secret_key)
        return user
    }
    catch(err){
        throw err
    }
}

export const verifyResetPasswordToken = (req) =>{
    try{
        const {resetToken} = req.cookies
        const user = jwt.verify(resetToken, process.env.secret_key)
        return user
    }
    catch(err){
        throw err
    }
}