import User from "../models/user_Model.js";
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notificationModel.js";
import bcrypt from "bcryptjs";
export const getUserProfile=async(req,res)=>{
    try{
        const {username} =req.params; //getting username from the url
        const user=await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({error: "User is Not found"});
        }
        res.status(200).json(user);
    }
    catch(error){
        console.log("Error in userGetProfile: ",error.message);
        res.status(500).json({error: error.message});
    }
}

export const getSuggestedUser = async (req, res) => {
	try {
		const userId = req.user._id;

		const usersFollowedByMe = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		// 1,2,3,4,5,6,
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const followUnfollowUser= async(req,res)=>{
    try{
        const {id} =req.params; //getting the id from the url
        const userToModify= await User.findById(id);
        const currentUser= await User.findById(req.user._id);
        if(id===req.user._id.toString()){
            return res.status(500).json({error: "You cant follow and unfollow yourself"});
        }
        if(!userToModify || !currentUser){
            return res.status(400).json({error: "User Not found"});
        }
        // check if the current user is follower or following 
        const isFollowing =currentUser.following.includes(id);
        if(!isFollowing){
            // unfollow the user
            await User.findByIdAndUpdate(id,{$pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push : {following:id}});
            // send Notification to the user 
            res.status(200).json({message: "User unfollowed successfully"});
        }
        else{
            //Follow the user
            await User.findByIdAndUpdate(id, {$push: {followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push:{following : id}});   
            // sending Notification to the user 
            const newNotification= new Notification({
                type:"follow",
                from: req.user._id,
                to:userToModify._id,
            })
            await newNotification.save(); 
            res.status(200).json({message: "User followed Successfully"});
        }

    }
    catch(error){
        console.log("Error in followUnfollowUser",error.message);
        return res.status(500).json({error: error.message});
    }
};

// import User from "../models/user_Model.js";
// import bcrypt from "bcryptjs";
// import cloudinary from "cloudinary"; // Assuming you have cloudinary properly configured

export const updateUserProfile = async (req, res) => {
    const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;
    console.log("id:",userId);

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if ((newPassword && !currentPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({ message: "Please provide both newPassword and currentPassword" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Password" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        // Updating the user profile
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        user.password = null; // Remove password from the response
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in profile update", error.message);
        return res.status(500).json({ error: error.message });
    }
};

