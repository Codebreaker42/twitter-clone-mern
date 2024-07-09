
import express from "express";
import authRoutes from "./routes/auth_routes.js";
import dotenv from "dotenv" // to read the .env file content 
dotenv.config();
const app=express();  //making instance of an express application
const PORT= process.env.PORT || 5000; //by default 5000 in case of PORT variable value is undefined
app.use("/api/auth",authRoutes);

console.log(process.env.MONGO_URI); //giving undefined because we have to use dotenv package to see the content of .env file
//starting the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})