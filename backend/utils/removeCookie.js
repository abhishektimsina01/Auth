export const removeAuthTokenCookie = (res) =>{
    try{
        res.clearCookie("token")
    }
    catch(err){
        throw err
    }
}

export const removeResetTokenCookie = (res) =>{
    try{
        res.clearCookie("resetToken")
    }
    catch(err){
        throw err
    }
}