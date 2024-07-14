import Post from "../models/postModel.js";
import User from "../models/user_Model.js";
import Notification from "../models/notificationModel.js";
import {v2 as cloudinary} from "cloudinary";
export const createPost= async(req,res)=>{
    // return res.status(400).json({message:"post"});
    try{
        const {text} =req.body;
        let {img} =req.body;
        const userId=req.user._id.toString();

        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({message: "user not found"});
        }
        if(!text && !img){
            return res.status(400).json({message: "post must have text or image"});
        }
        if(img){
            const uploadedResponse= cloudinary.uploader.upload(img);
            img= uploadedResponse.secure_url;
        }

        const newPost=new Post({
            user:userId,
            text,
            img
        });

        await newPost.save();
        res.status(201).json({newPost});
    }
    catch(error){
        console.log("error in createPost controller",error.message);
        res.status(500).json({error: "internal server error"});
    }
}

export const likeUnlikePost= async(req,res)=>{
    try{
        const {id: postId} =req.params.id;
        const userId=req.user._id;

        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        const userLikedPost=post.likes.includes(userId); // just check if user already liked the post
        if(userLikedPost){
            //unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}});
            res.status(200).json({message: "Post Unliked"});
        }
        else{
            // like post 
            post.likes.push(userId);
            await User.updateOne({_id:userId},{$push:{likedPosts:postId}});
            await post.save();
            //send back the notification
            const notification= new Notification({
                from:userId,
                to:post.user,
                type:"like"
            })
            await Notification.save();
            res.status(200).json({message:"Post liked successfully"});
        } 
    }
    catch(error){
        console.log("error in likeUnlikePost",error.message);
        return res.status(500).json("Internal Server error");
    }
}

export const commentOnPost= async(req,res)=>{
    try{
        const text=req.body;
        const {postId}=req.params.id;
        console.log(postId)
        const userId=req.user._id;
        if(!text){
            return res.status(400).json({error: "This field is required"});
        }

        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({error:"Post not found"});
        }

        const comment={
            user:userId,
            text:text.toString()
        };

        post.comments.push(comment);
        await post.save();
        return res.status(200).json(post);
    }
    catch(error){
        console.log("error in commentOnPost", error.message);
        return res.status(400).json({error:  "Internal server error"});
    }
}

export const deletePost= async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        // checking is the authenticated person is deleting the post or not
        if(post.user.toString()!== req.user._id.toString()){
            return res.status(401).json({message:"You are not authorized to delete this post"});
        }
        // if post has an image delete it 
        if(post.img){
            const imgId= post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        // deleting the post from the database
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post is deleted successfully");
    }
    catch(error){
        console.log("error in deletePost ",error.message);
        return res.status(500).json("internal server error");
    }
}

export const getAllPosts= async (req,res)=>{
    try{
        // populate() function gives the all information about the id in the database
        // const posts=await Post.find().sort({createdAt:-1}) // give the latest post at the top
        const posts= await Post.find().sort({createAt: -1}).populate({// extracting the all information about the user who belong to the post
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        });
        if(posts.length===0){
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

export const getLikedPosts= async (req,res)=>{
    // only for returning the post saving the post logic is writtent on the above likeUnlikePost() function
    const userId=req.params.id;
    try{
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "user not found"});
        }
        const likedPosts= await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path:"user",
            select:"-password"
        }).
        populate({
            path:"comments.user",
            select:"-password"
        });
        res.status(200).json(likedPosts)
    }
    catch(error){
        console.log("Error in getLikedPost",error.message);
        return res.status(500).json({error: "internal server error"});
    }
}

export const getFollowingPosts=async(req,res)=>{
    try{
        const userId=req.user._id;
        const user=await User.findOne(userId);
        if(!user){
            return res.status(404).json("User not found");
        }
        const following=user.following;

        const feedPosts= await Post.find({user:{$in: following}})
        .sort({createAt:-1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        });
        res.status(200).json(feedPosts)

    }
    catch(error){
        console.log("error in getFollowingPosts",error.message);
        return res.status(500).json({error: "internal server error"});
    }
}

export const getUserPosts= async(req,res)=>{
    try{
        const {username} = req.params;
        const user=await User.findOne({username});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        const posts= await Post.find({user: user._id})
        .sort({createdAt: -1})
        .populate({
            path:"user",
            select: "-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        })
        return res.status(202).json(posts);
    }
    catch(error){
        console.log("error in getUserPosts",error.message)
        return res.status(500).json("Internal Server Error");
    }
}