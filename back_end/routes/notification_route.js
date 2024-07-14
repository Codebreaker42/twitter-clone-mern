import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";

const router=express.Router()
router.get("/",protectRoute,getNotificationsController);
router.delete("/",protectRoute,deleteNotifications);
export default router;