import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Register user service

export const registerUserService = async (userData) => {

  const { username, email, password } = userData;

  // Check whether user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already registered, please login to continue");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in MongoDB
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // Return safe user information
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
};

// Login user service

export const loginUserService = async (userData) =>{
    const {email, password} =  userData;

    // Find user by email
    const existingUser = await User.findOne({email});

    if(!existingUser){
      const error = new Error("User does not exist");
      error.statusCode= 404;
      throw error;
    }

    // Compare Password
    const isPasswordcorret = await bcrypt.compare(password,existingUser.password);

    if (!isPasswordcorret){
      const error = new Error("Invalid email or password");
      error.statusCode=401;
      throw error;
    }

    //Genrate JWT Token
    const token = jwt.sign(
      {userId: existingUser._id},
      process.env.JWT_SECRET,
      {expiresIn:"10d"}
    );

    //return usre and token

    const user = {
      _id:existingUser._id,
      username:existingUser.username,
      email:existingUser.email,
    };

    return{user, token};
};