import { config } from "dotenv";
import { jwt } from "jsonwebtoken";
import Admin from "../models/admin.model"; 
import sendResponse from "../utils/sendResponse";
import sendError from "../utils/sendError";

const adminAuth = async(req, res, next ) => {

  try{

   const token = req.headers.authorization

   if(!token){
    return sendResponse(res, 400, "Token is required");
   }

   const decoded = await jwt.verify(token, process.env.JWT_SECRET_ADMIN);
  console.log("verify_token",decoded)

  const adminId = decoded.adminId

  const admin = await Admin.findById(adminId)

  if (!admin) {

    return sendResponse(res, 404, "Admin does not exit");

  }

  req.admin = admin

  next()

  } catch (error) {

    return sendError(res, 500, error.message);

  }
}

export default adminAuth