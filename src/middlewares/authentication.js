import "dotenv/config"
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js"

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      })
    }
  const decoded = await jwt.verify(token, process.env.JWT_SECRET)
  console.log("check... ",decoded)

  const userId = decoded.userId

  const user = await User.findById(userId)

  if (!user) {
    return res.status(404).json({
      message: "User does not exist"
    })
  }

  req.user = user

  next()
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export default authentication