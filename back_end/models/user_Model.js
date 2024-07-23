import mongoose from 'mongoose';

// creating the collections
const userSchema=new mongoose.Schema({
    // creating the user data fields as object
    username:{
        type:String,
        required: true,
        unique: true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type: String,
        required:true,
        unique:true,
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref:"User", // person has to be the user of the site.
            default:[] //initially the user has no followers
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[] //initially the user have no following
        }
    ],
    profileImg:{
        type:String,
        default:"",
    },
    coverImg:{
        type:String,
        default:"",
    },
    bio:{
        type:String,
        default:"",
    },
    link:{
        type:String,
        default:"",
    }
},{timestamps:true}) // this object is optional

const User=mongoose.model("User",userSchema); // take two arguments first is collection name and second is the blueprint of our collections

export default User;