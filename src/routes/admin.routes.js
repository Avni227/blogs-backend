import { Router } from "express";
// import adminAuth from "../middlewares/admin.middlewares.js";
import adminAuth from "../middlewares/admin.middleware.js";
import { createAdmin, loginAdmin, getAllUsers, getAllBlogs, suspendUser} from "../controllers/admin.controller.js";

const router = Router();

router.post("/create-admin", createAdmin);
router.post("/login-admin", loginAdmin);
router.get("/get-all-users", adminAuth, getAllUsers);
router.get("/get-all-blogs", adminAuth, getAllBlogs);
router.patch("/suspend-user/:userId",adminAuth,suspendUser);

export default router;
