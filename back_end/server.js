
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv" // to read the .env file content 
import {v2 as cloudinary} from "cloudinary";
// routes 
import authRoute from "./routes/auth_route.js";
import usersRoute from "./routes/users_route.js"
import postRoute from "./routes/post_route.js";
import notificationRoute from "./routes/notification_route.js"
import connectMongoDB from "./db/connectMongoDB.js";

// connect with cloudinary account to upload and delete images
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
connectMongoDB();  //connection estiblishment of database
const app=express();  //making instance of an express application
const PORT= process.env.PORT || 5000; //by default 5000 in case of PORT variable value is undefined

app.get("/",(req,res)=>{
    res.send("<h1> hello world </h1>");
})
app.use(express.json()); // middleware(to parse req.body) 
app.use(express.urlencoded({extended:true})); //to parse form data (urlencoded)
app.use(cookieParser()); //middleware to parse the cookie in protectRoute.js file

app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/posts",postRoute); 
app.use
console.log(process.env.MONGO_URI); //giving undefined because we have to use dotenv package to see the content of .env file
//starting the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})