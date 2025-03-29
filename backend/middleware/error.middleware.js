import dotenv from "dotenv"
dotenv.config()

const notFound = (req,res,next)=>{
    const err = new Error(`${req.url} for ${req.method} not found`)
    err.status = 404
    next(err)
}

const errorHandler = (err, req,res, next) =>{
    const message = err.message
    const code = err.status || 502
    res.status(code).json({
        error : message,
        stack : process.env.state == "production state" ?  undefined : err.stack
    })
}

export {notFound, errorHandler}