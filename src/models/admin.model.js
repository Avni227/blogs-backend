import { model, Schema } from "mongoose";

const adminSchema = new Schema({
  adminname:{type:String, default:null},
  email:{type:String, unique:true, default:null},
  password:{type:String, default:null},
},{timestamps:true});

const Admin = model("admin", adminSchema);
export default Admin;