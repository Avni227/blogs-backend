import {connect} from 'mongoose'
import "dotenv/config"


const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI)
    console.log("Mongodb connected successfully")
  } catch (error) {
    console.log("Error connecting to mongodb")
  }
}

export default connectDB