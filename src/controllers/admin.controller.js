import Admin from "../models/admin.model.js";
import sendError from "../utils/sendError.js";
import sendResponse from "../utils/sendResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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