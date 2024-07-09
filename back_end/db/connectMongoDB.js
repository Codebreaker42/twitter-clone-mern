import mongoose from "mongoose";

const connectMongoDB= async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(error){
        console.error(`error connect to MongoDB database: ${error.message}`);
        process.exit(1);
    }
}
export default connectMongoDB;