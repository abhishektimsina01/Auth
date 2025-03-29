//generates token for withentication and authorization
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const AuthenticationToken = (userId) =>{
    const token = jwt.sign({userId}, process.env.secret_key)
    return token
}

