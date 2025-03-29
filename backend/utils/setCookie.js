import { AuthenticationToken } from "./AuthenticationToken.js"

export const setCookie = (res, cookie_name, token) =>{
    res.cookie(`${cookie_name}`, token, {
        httpOnly : true,
        secure : false,
        maxAge : 24 * 60  * 60 * 1000,
        sameSite : "strict"
    })
}