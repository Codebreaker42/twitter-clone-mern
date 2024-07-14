import Notification from "../models/notificationModel.js";

export const getNotifications= async(req,res)=>{
    try{
        const userId= req.user._id;
        const notification= await Notification.find({to:userId})
        .populate({
            path:"from",
            select:"username profileImg"
        });
        await Notification.updateMany({to:userId},{read:true});
        res.status(200).json(notification);
    }
    catch(error){
        console.log("error in getNotification",error.message);
        return res.status(500).json({error:"Internal Server Errro"});
    }
}

export const deleteNotifications= async(req,res)=>{
    try{
        const userId= req.user._id;
        await Notification.deleteMany({to:userId});

        res.status(200).json({message: "Notification deleted succesfully"}); 
    }
    catch(error){
        console.log("error in deleteNotificatio",error.message);
        return res.status(200).json({error:"internal server error"});
    }
}

export const deleteOneNotifications= async(req,res)=>{
    try{
        const notifyId= req.params.id;
        const userId= req.user._id;
        const notification= await Notification.findById(notifyId);
        
        if(!notifyId){
            return res.status(404).json({error: "Notification not found"});
        }
        // checking user has permission to delete the notification

        if(notification.to.toString()!== userId.toString()){
            return res.status(403).json({error:"you are not allowed to delete this notification"});
        }

        await Notification.findByIdAndDelete(notifyId);
        res.status(200).json({message: "notification deleted successfully"});
    }
    catch(error){
        console.log("error in deleteOnePost",error.message);
        return res.status(500).json({error: "Internal server Error"});
    }
}