import express from "express"
import dotenv from "dotenv"
import mongoose, { connect } from "mongoose"
import { notFound, errorHandler } from "./middleware/error.middleware.js"
import { user } from "./routes/user.router.js"
import {ConnectToDatabase} from "./db/connect.db.js"
import cookieParser from "cookie-parser"
dotenv.config()

const app = express()
// connecting to the database
ConnectToDatabase()
//cookie parse
app.use(cookieParser())
//request body parser
app.use(express.urlencoded({extended : true}))
app.use(express.json())

//routes middleware
app.use("/user", user)


//middleware for error handling
app.use(notFound)
app.use(errorHandler)

//starting the serverr
app.listen(process.env.port, (err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("the server has been started succesfully")
    }
})