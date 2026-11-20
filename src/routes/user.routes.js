import { Router } from "express";
import { loginUser, registerUser, getAllUsers, forgotPassword, resetPassword } from "../controllers/user.controller.js";

const router = Router()

router.get("/get-all-users", getAllUsers)
router.post("/register-user", registerUser)
router.post("/login-user", loginUser)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router;

