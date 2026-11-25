import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import sendEmail from "../utils/nodemailer.js";
import emailTemplate from "../services/emailTemplate.js";
import sendRespons from "../utils/sendResponse.js"
import sendError from "../utils/sendError.js";

export const registerUser = async (req, res) => {
  try {

     console.log("Request Body:", req.body);

   

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return sendRespons(res, 400, "All fields are required");
    }
    //console.log("Connected Database:", User.db.name);
    //console.log("Collection:", User.collection.name);
    //console.log("Checking email:", email);

      
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendRespons(res, 401, "User already registered, please login to continue");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return sendRespons(res, 201, "User created successfully", user);
    
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendRespons(res, 400, "Both email and password are required");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return sendRespons(res, 400, "User does not exist, please register first");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return sendRespons(res, 401, "Invalid password");
    }

    if (existingUser.status === "suspended") {
    return sendRespons(
      res,
      403,
      "Your account has been suspended. Please contact the administrator."
    );
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      },
    );

    return sendRespons(res, 200, "User logged in successfully", {token, existingUser});

  } catch (error) {

    return sendError(res, error);

  }
};

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

    return sendRespons(res, 404, "user not found");

  }

  return sendRespons(res, 200, "All user get successfuly", data);

 }catch(error){

  return sendError(res, error);

 }

};

export const forgotPassword = async (req, res) => {
  try {
    const {email} = req.body
    
    if (!email) {
      return sendRespons(res, 401, "Email is required");
    }

    const user = await User.findOne({email})

    if (!user) {
      return sendRespons(res, 404, "User not found");
    }

    const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
      expiresIn: "15m"
    })

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000;
    await user.save()


    const resetPasswordUrl = `http://localhost:5173/reset-password/${token}`

    // Generate email HTML
    const html = emailTemplate({
      username: user.username,
      resetPasswordUrl
    });

    //node mailer
    await sendEmail({
      to: user.email,
      subject:"Reset your password",
     html,
    })

    return sendRespons(res, 201, "Reset password link sent successfully", data);
    
  } catch (error) {

    return sendError(res, error);

  }
}


export const resetPassword = async (req, res) => {
  try {
    const {password, confirmPassword} =  req.body
    const {token} = req.params

    if (!token) {
      return sendRespons(res, 401, "Token is required in params");
    }


    if (!password || !confirmPassword ) {
      return sendRespons(res, 401, "Both fields are required");
    }

    if (password !== confirmPassword) {

      return sendRespons(res, 403, "Password and confirm password must be same");

    }

    //let decoded = await jwt.decode(token, process.env.JWT_SECRET)
    let decoded = await jwt.verify(token, process.env. JWT_SECRET)

    const userId = decoded.userId

    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now()}
    })

    if (!user) {
      return sendRespons(res, 404,"User not found" );
    }

  const previouspassword = user.password ;
  const isSamePassword = await bcrypt.compare(password, previouspassword);

    if (isSamePassword) {

      return sendRespons(res, 400, "You can not use your previous password");

    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save()

    return sendRespons(res, 201, "Password reset successfully", data);


  } catch (error) {
    return sendError(res, error);
  }
}
