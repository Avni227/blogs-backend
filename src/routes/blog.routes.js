import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import { createBlog, deleteBlog, getAllBlogs, getMyblogs, editBlog } from "../controllers/blog.controller.js";
import upload from "../utils/multer.js";

const router = Router();
//Public routes
router.get("/get-all-blogs", getAllBlogs);



//Protected routes
router.post('/create-blog', authentication,upload.single("image"), createBlog);
router.get("/get-my-blogs", authentication, getMyblogs);
router.delete("/delete-blog/:blogId", authentication, deleteBlog);
router.patch("/edit-blog/:blogId", authentication, editBlog);

export default router;