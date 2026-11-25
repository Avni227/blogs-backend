import "dotenv/config"
import jwt from 'jsonwebtoken'
import sendResponse from "../utils/sendResponse.js"
import sendError from "../utils/sendError.js"
import User from "../models/user.model.js"

const authentication = async (req, res, next) => {
  
  try {

    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(res, 400, "Token is required");
    }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET)

  console.log("check... ",decoded)

  const userId = decoded.userId

  const user = await User.findById(userId)

  if (!user) {
      return sendResponse(res, 403, "User does not exist");
  }

  if (user.status === "suspended") {
  return sendResponse(res, 403, "Your account has been suspended");
  }

  req.user = user;
  next();

  } catch (error) {

     return sendError(res, 500, error.message);

  }
}

export default authentication