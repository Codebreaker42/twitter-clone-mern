import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotifications,deleteNotifications, deleteOneNotifications} from "../controllers/notifications_controller.js";

const router=express.Router()

router.get("/all",protectRoute,getNotifications); // get all notification of the login user
router.delete("/delete",protectRoute,deleteNotifications); //delete all notification of the login user
router.delete("/deleteone/:id",protectRoute,deleteOneNotifications)
router
export default router;