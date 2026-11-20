import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import { createBlog, deleteBlog, getAllBlogs, getMyblogs, editBlog, getSingleBlogDetail} from "../controllers/blog.controller.js";
import upload from "../utils/multer.js";

const router = Router();

//Public routes
router.get("/get-all-blogs", getAllBlogs);

//Protected routes
router.post('/create-blog', authentication, upload.array("images", 5), createBlog);
router.get("/get-my-blogs", authentication, getMyblogs);
router.get("/get-blog-detail/:blogId", authentication, getSingleBlogDetail);
router.delete("/delete-blog/:blogId", authentication, deleteBlog);
router.patch("/edit-blog/:blogId", authentication, editBlog);

export default router;