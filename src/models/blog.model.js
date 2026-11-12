import { model, Schema } from "mongoose";

const blogSchema = new Schema({
  title:{type:String,default:null},
  description:{type:String, default:null},
  userId : {type: Schema.Types.ObjectId, ref: "User"} // connet the user collection(table) into blog collection(table) 
},{timestamps:true});

const Blog = model("blog", blogSchema);
export default Blog;

