import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const registerUser = async (req, res) => {
  try {

     console.log("Request Body:", req.body);

    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    console.log("Connected Database:", User.db.name);
    console.log("Collection:", User.collection.name);
    console.log("Checking email:", email);

      
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        message: "User already registered, please login to continue",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Both email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "User does not exist, please register first",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      },
    );

    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        existingUser,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
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
    return res.status(404).json({
      message:"user not found"
    });
  }

  return res.status(200).json({
   message:"All user get successfuly",
   data:users
  });

 }catch(error){

  return res.error.status(500).json({
    message:error.message
  });

 }

};
