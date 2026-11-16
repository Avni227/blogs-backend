import { Router } from "express";
import { loginUser, registerUser, getAllUsers } from "../controllers/user.controller.js";

const router = Router()

router.get("/get-all-users", getAllUsers)
router.post("/register-user", registerUser)
router.post("/login-user", loginUser)

export default router

