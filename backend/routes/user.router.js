import express from "express"
import {gethome,SignUpUser, LogInUser, isExpired, profile, delUser, updateUser, passwordCheck, logoutUser, forgetPassword, resetPassword } from "../controllers/user.controllers.js"
const user = express.Router()

user.get("/home", gethome)
user.get("/delUser", delUser)
user.post("/signup", SignUpUser)
user.post("/login", passwordCheck, LogInUser)
user.post("/isExpired", isExpired)
user.get("/profile", profile)
user.post("/updateUser", updateUser)
user.get("/logout", logoutUser)
user.post("/forgetPassword", forgetPassword)
user.post("/resetPassword", resetPassword)
export {user}