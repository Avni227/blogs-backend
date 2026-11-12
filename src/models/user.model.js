import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {type: String, default:null},
  email: {type: String, unique: true, default:null},
  password: {type: String, default: null}
},{timestamps: true})

const User = model("User", userSchema)

export default User