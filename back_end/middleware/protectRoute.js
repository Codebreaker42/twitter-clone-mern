import User from "../models/user_Model.js"
import jwt from "jsonwebtoken";
//building the custom middleware
export const protectRoute= async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        // if token is not existed
        if(!token){
            return res.status(401).json({error:"Unauthorized: No token Provided"});
        }
        // if there is cookie and invalid
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"Unauthorized : Invalid Token"});
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({error:"User not Found"});
        }
        req.user=user;
        console.log(req.user);
        next();
    }
    catch(error){
        console.log("error in protectRoute middleware",error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}
