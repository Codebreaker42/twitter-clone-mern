import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user_Model.js";
import bcrypt from "bcryptjs"; // for hashing
//sign up endpoint
export const signup= async (req,res)=>{
    try{
        if(!req.body){
            return res.status(300).json({error:"invalid body"});
        }
        const {fullname,username,email,password}= req.body;// it extract the all values from the react form.
        //  form validation
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        //check if user and email is already exist or not.
        const existingUser= await User.findOne({username});
        const existingEmail= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:"Username is already exist"});
        }
        if(existingEmail){
            return res.status(400).json({error:"Email is already exist"});
        }
        if(password.length<6){
            return res.status(400).json({error: "password length atleast 6 charecter long"});
        }
         // Hash the password using bcrypt
         let hashPassword;
         try {
             const salt = await bcrypt.genSalt(10);
             hashPassword = await bcrypt.hash(password, salt);
         } catch (err) {
             console.error("Error hashing password:", err);
             return res.status(500).json({ error: "Error hashing password" });
         }

        // Store signup information in the collection
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword
        });

        try {
            await newUser.save();
            generateTokenAndSetCookie(newUser._id,res);
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } catch (err) {
            console.error("Error saving user:", err);
            res.status(500).json({ error: "Error saving user" });
        }
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({error:"internal server error"});
    }
}

// login endpoint
export const login=async (req,res)=>{
    const {username,password} =req.body;
    const user=await User.findOne({username});
    const isPasswordCorrect= await bcrypt.compare(password,user?.password || "");

    if(!user || isPasswordCorrect){
        return res.status(400).json({error: "Invalid username and password"});
    }
    generateTokenAndSetCookie(user._id,res);
    return res.json({
        _id: user._id,
        fullname:user.fullName,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
    })
}

// logout endpoint
export const logout=async (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged Out Successfully"})
    }
    catch(error){
        console.log("error in logout");
        res.status(500).json({error: "Internal Server Error"});
    }
}

// to check if token is valid 
// to check user is already authenticated 
export const getMe= async (req,res)=>{
    try{
        const user=await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }
    catch(error){
        console.log("error in getMe controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
}