import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost,likeUnlikePost,commentOnPost,deletePost, getAllPosts ,getLikedPosts, getFollowingPosts, getUserPosts} from "../controllers/post_controller.js";
const router=express.Router();

router.get("/all",protectRoute,getAllPosts); //give the all post of the user and the followers and following also
router.get("/likes/:id",protectRoute,getLikedPosts); // gives the information of people who likes the particular post
router.post('/create',protectRoute,createPost); // allow user to push the post 
router.get('/user/:username',protectRoute,getUserPosts); //gives the post of any user in the twitter
router.get("/following",protectRoute,getFollowingPosts); // gives the post of the following people followed by login user
router.get('/like/:id',protectRoute,likeUnlikePost); // allow login user to like or unlike the post
router.get('/comment/:id',protectRoute,commentOnPost); //allow login user to comment on the particular post
router.delete("/:id",protectRoute,deletePost); //allow login user to the delete it's post.
export default router;