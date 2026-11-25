import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import mongoose from "mongoose";
import sendError from "../utils/sendError.js";
import sendResponse from "../utils/sendResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Admin Register
export const createAdmin = async(req, res) => {
try{

  const {adminname, email, password} = req.body;

  if(!adminname || !email || !password){

   return sendResponse(res, 400, "All fileds are required");

  }

  const hashedPassword = await bcrypt.hash("12345678", 10);

  const admin = await Admin.create({
   adminname:"admin",
   email:"admin@gmail.com",
   password:hashedPassword
  });

  return sendResponse(res, 201, "Admin created successfully", admin);

}catch(error){

  return sendError(res, 500, error.message);

}
};

//Admin Login
export const loginAdmin = async(req, res) => {
  try
    {

    const {email, password} = req.body;

    if(!email || !password){

      return sendResponse(res, 400, "All fileds are required");

    }

    const existingAdmin = await Admin.findOne({email});
    console.log("existingAdmin", existingAdmin);

      if (!existingAdmin) {
        return sendResponse(res, 400, "Admin does not exist");
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingAdmin.password,
      );

      console.log("correct", isPasswordCorrect);

      if (!isPasswordCorrect) {
        return sendResponse(res, 401, "Invalid password");
      }

      const token = jwt.sign(
        { adminId: existingAdmin._id },
        process.env.JWT_SECRET_ADMIN,
        {
          expiresIn: "10d",
        },
      );

      console.log("token check", token);

      return sendResponse(res, 200, "Admin logged in successfully", {token, existingAdmin});

  }catch(error){

    return sendError(res, 500, error.message);

  } 
};

//Get All Users
export const getAllUsers = async (req, res)=> {

 try{

   const {search = ""} = req.query;
 // filter or search
    const filter = {};
    if(search){
      filter.username={
        $regex:search,
        $options:"i"
      }
    }


  const users = await User.find(filter);

  if(!users){

    return sendResponse(res, 404, "user not found");

  }

  return sendResponse(res, 200, "All user get successfuly", users);

 }catch(error){

  return sendError(res, error);

 }

};

//GET All Blogs
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
    //console.log(totalBlogs)

    const totalPages = Math.ceil(totalBlogs / limit);
  
     // Prepare pagination
    const pagination = {
      currentPage,
      totalPages,
      totalBlogs,
      limit,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };

    if (blogs.length === 0) {
      return sendResponse(res, 404, "Blogs not found");
    }

    return sendResponse(res, 200, "Blogs fetched successfully", blogs, pagination);
   

  } catch (error) {
    return sendError(res, error.message);
  }
};

//SUSPEND Users
export const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendResponse(res, 400, "Invalid user ID");
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    // Check if already suspended
    if (user.status === "suspended") {
      return sendResponse(res, 400, "User is already suspended");
    }

    // Change status
    user.status = "suspended";

    await user.save();

    return sendResponse(res, 200, "User suspended successfully", {
      userId: user._id,
      status: user.status
    });

  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// export BAN Blogs
export const banBlog = async (req, res) =>{
  
}