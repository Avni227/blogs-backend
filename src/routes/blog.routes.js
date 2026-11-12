import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import { createBlog, deleteBlog, getAllBlogs, getMyblogs } from "../controllers/blog.controller.js";

const router = Router();
//Public routes
router.get("/get-all-blogs", getAllBlogs);



//Protected routes
router.post('/create-blog', authentication, createBlog);
router.get("/get-my-blogs", authentication, getMyblogs);
router.delete("/delete-blog/:blogId", authentication, deleteBlog)

export default router;