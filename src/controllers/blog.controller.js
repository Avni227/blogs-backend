// import { response } from "express";
import Blog from "../models/blog.model.js";
import sendRespons from "../utils/sendResponse.js"
import sendError from "../utils/sendError.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const user_id = req.user._id;

    const { title, description } = req.body;

    if (!title || !description || !req.file) {
      return sendRespons(res, 400, "all fileds are required");
    }

    const blog = await Blog.create({
      title,
      description,
      image: `/public/${req.file.filename}`,
      userId: user_id,
    });
   return sendRespons(res, 201, "Blog creatd sucessfully",blog);

  } catch (error) {
    return sendError(res, error.message);
  }
};

// GET All Blogs
export const getAllBlogs = async (req, res) => {
  try {

    //Pagination with shorting
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search=""
    } = req.query;

    // Allow only supported sorting fields
    const allowedSortFields = ["title", "createdAt", "updatedAt"];

    const field = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const direction = sortOrder === "asc" ? 1 : -1;

    const sortOptions = {
      [field]: direction,
    };

    //pagination
    const skip = (Number(page) - 1) * Number(limit);
    const currentPage = Number(page);

    // filter or search
    const filter = {};
    if(search){
      filter.title={
        $regex:search,
        $options:"i"
      }
    }
    
    const blogs = await Blog.find(filter)
      .populate("userId", "email username")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const totalBlogs = await Blog.countDocuments(filter);

    const totalPages = Math.ceil(totalBlogs / limit);

    if (!blogs) {
      return sendRespons(res, 404, "Blogs not found");
    }

    return sendRespons(res, 200, "Blogs fetched successfully", data, pagination);
   

  } catch (error) {
    return sendError(res, error);
  }
};

//GET MYBlogs
export const getMyblogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search="" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const currentPage = Number(page);
    const userId = req.user._id;

    // filter or search
    const filter = {
      userId: userId 
    };

    if(search){
      filter.title = {
        $regex:search,
        $options:"i"
      }
    }
    const blogs = await Blog.find(filter)
      .populate("userId", "email username")
      .sort({createdAt:-1})
      .skip(skip)
      .limit(Number(limit));

    const totalBlogs = await Blog.countDocuments(filter);

    const totalPages = Math.ceil(totalBlogs / limit);

    if (!blogs) {
      return sendRespons(res, 404, "Blogs not found");
    }

    return sendRespons(res, 200, "Blogs fetched successfully", pagination);

  } catch (error) {

    return sendError(res, error);

  }
};

//DELETE BLOG = method:1 (working) //https://chatgpt.com/c/6aeb091d-8bc0-83ee-8f69-34a4a34e5121
// export const deleteBlog = async (req, res) => {
//   try {
//     const userId = req.user._id
//     const {blogId} = req.params

//     const blog = await Blog.findOneAndDelete({
//       _id: blogId,
//       userId: userId
//     })

//     if (!blog) {
//       return res.status(401).json({
//         message: "Blog not found or unauthorized"
//       })
//     }

//     return res.status(200).json({
//       message: "Blog deleted successfully",
//       blog
//     })
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message
//     })
//   }
// }

//DELETE BLOG = method:2 (working)

export const deleteBlog = async (req, res) => {
  try {
    const userId = req.user._id;

    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return sendRespons(res, 404,"Blog not found" );
    }

    if (blog.userId.toString() !== userId.toString()) {
      return sendRespons(res, 403,"you are not authorized to delete this blog" );
    }

    // Delete specific blog
    await Blog.findByIdAndDelete(blogId);
   return sendRespons(res, 200, "Blog deleted successfully" );
  
  } catch (error) {
    return sendError(res, error);
  }
};

//Edit Blog API
export const editBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { blogId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return sendRespons(res, 404, "BLog not found" );
    }

    if (blog.userId.toString() !== userId.toString()) {
      return sendRespons(res, 401, "You are not allowed to edit this blog" );
    }

    let updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $set: updatedData,
      },
      { new: true },
    );

    if (!updatedBlog) {
      return sendRespons(res, 400, "Error while editing the blog" );
    }

    return res.status(201).json({
      message: "Blog updated successfully",
      updatedBlog,
    });
    
  } catch (error) {
    return sendError(res, error);
  }
};
