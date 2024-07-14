import express from "express";

import {login,logout,signup,getMe} from "../controllers/auth_controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router= express.Router();
// routes are defining here
router.get("/me",protectRoute,getMe); //here protectRoute is an middleware
router.get("/signup",signup);
router.get("/login",login); 
router.get("/logout",protectRoute,logout);

export default router;