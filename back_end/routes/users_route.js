import express from "express";
import { getUserProfile,getSuggestedUser,followUnfollowUser,updateUserProfile} from "../controllers/user_controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router=express.Router();

router.get("/profile/:username",getUserProfile);// userprofile page
router.get("/suggested",protectRoute,getSuggestedUser); // suggestion 
router.get("/follow/:id",protectRoute,followUnfollowUser); //to allow follow and unfollow 
router.get("/update",protectRoute,updateUserProfile); //updating the profile
export default router;