import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {type: String, default:null},
  email: {type: String, unique: true, default:null},
  password: {type: String, default: null},
  status:{type: String, enum: ["active", "suspended"], default: "active"},
  resetPasswordToken: {type: String, default: null},
  resetPasswordExpiry: {type: Date, default: null}
},{timestamps: true})

const User = model("User", userSchema)

export default User