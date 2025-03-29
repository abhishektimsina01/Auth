import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()

export async function ConnectToDatabase(){
    try{
        await mongoose.connect(process.env.db_url)
        console.log("the database is connected")
    }
    catch(err){
        console.log(err)
    }
}