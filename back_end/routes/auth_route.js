import express from "express";

import {login,logout,signup,getMe} from "../controllers/auth_controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router= express.Router();
// routes are defining here
router.get("/me",protectRoute,getMe); //here protectRoute is an middleware
router.post("/signup",signup);
router.post("/login",login); 
router.post("/logout",protectRoute,logout);

export default router;