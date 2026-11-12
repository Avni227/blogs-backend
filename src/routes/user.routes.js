import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router()

router.post("/register-user", registerUser)
router.post("/login-user", loginUser)

export default router

