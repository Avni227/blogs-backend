import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import sendEmail from "../utils/nodemailer.js";
import emailTemplate from "../services/emailTemplate.js";

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

export const forgotPassword = async (req, res) => {
  try {
    const {email} = req.body
    
    if (!email) {
      return res.status(401).json({
        message: "Email is required"
      })
    }

    const user = await User.findOne({email})

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
      expiresIn: "15m"
    })

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
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
    return res.status(201).json({
      message: "Reset password link sent successfully",
      data: resetPasswordUrl
    })
    
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}


export const resetPassword = async (req, res) => {
  try {
    const {password, confirmPassword} =  req.body
    const {token} = req.params

    if (!token) {
      return res.status(401).json({
        message: "Token is required in params"
      })
    }


    if (!password || !confirmPassword ) {
      return res.status(401).json({
        message: "Both fields are required"
      })
    }

    if (password !== confirmPassword) {
      return res.status(403).json({
        message: "Password and confirm password must be same"
      })
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
      return res.status(404).json({
        message: "User not found"
      })
    }
  const previouspassword = user.password ;
  const isSamePassword = await bcrypt.compare(password, previouspassword);

    if (isSamePassword) {
      return res.status(400).json({
        message: "You can not use your previous password"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save()

    return res.status(201).json({
      message: "Password reset successfully",
      data: user
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}
