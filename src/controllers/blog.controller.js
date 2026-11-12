import { response } from "express";
import Blog from "../models/blog.model.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {

    const user_id = req.user._id;

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "all fileds are required",
      });
    }

    const blog = await Blog.create({
      title,
      description,
      userId: user_id,
    });

    return res.status(201).json({
      message: "Blog creatd sucessfully",
      data: blog,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET All Blogs
export const getAllBlogs = async (req, res) => {
  try {

    const {
      page=1,
      limit=10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    // Allow only supported sorting fields
      const allowedSortFields = ["title", "createdAt", "updatedAt"];

      const field = allowedSortFields.includes(sortBy)
  ? sortBy
  : "createdAt";

  const direction = sortOrder === "asc" ? 1 : -1;

  const sortOptions = {
  [field]: direction
};

    const skip = (Number(page)-1) * Number(limit)

    const currentPage = Number(page);
 
    const blogs = (await Blog.find().populate("userId","email username").sort(sortOptions).skip(skip).limit(Number(limit)));
    
    const totalBlogs = await Blog.countDocuments();

    const totalPages = Math.ceil(totalBlogs / limit);

    if(!blogs) {
      return res.status(404).json({
        message: "Blogs not found"
      })
    }
   
    return res.status(200).json({
      messager:"Blogs fetched successfully",
      data: blogs,
      pagination: {
        currentPage,
        totalPages,
        limit: limit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

//GET MYBlogs
export const getMyblogs = async (req, res) => {

  try {
    const {page=1, limit=10} = req.query;
    const skip = (Number(page)-1) * Number(limit);
    const currentPage = Number(page);
    const userId = req.user._id;
    
    const blogs = await Blog.find({userId: userId}).populate("userId", "email username").skip(skip).limit(Number(limit));

    const totalBlogs = await Blog.countDocuments({ userId:userId });

    const totalPages = Math.ceil(totalBlogs/limit);

    if (!blogs) {
      return res.status(404).json({message: "Blogs not found"})
    }

    return res.status(201).json({
      message: "Blogs fetched successfully",
      data: blogs,
      pagination:{
      currentPage,
      totalPages,
      limit:limit,
      hasNextPage:currentPage < totalPages,
      hasPreviousPage: currentPage > 1
      }
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
      
    })
  }
}

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

    const {blogId} = req.params;

    const blog = await Blog.findById(blogId);

    if(!blog){
      return res.status(404).json({
      message:"Blog not found"
      });
    }

    if(blog.userId.toString() !== userId.toString()){
      return res.status(403).json({
       message:"you are not authorized to delete this blog"
      });
    }

     // Delete specific blog
    await Blog.findByIdAndDelete(blogId)

    return res.status(200).json({
     message:"Blog deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
    message:error.message()
    
    });
  }

};