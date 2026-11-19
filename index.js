import express from "express";
import "dotenv/config";
import fs from "fs";
import path from "path";
import connectDB from "./src/configs/db.config.js";
import cors from 'cors';
import userRouter from './src/routes/user.routes.js';
import blogRouter from './src/routes/blog.routes.js';
import imageRoutes from "./src/routes/image.routes.js";

const app = express()
const port = process.env.PORT

// Automatically create public folder if it doesn't exist
const publicFolder = path.join(process.cwd(), "public");

if (!fs.existsSync(publicFolder)) {
  fs.mkdirSync(publicFolder, { recursive: true });
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

await connectDB()


app.use(express.json())
app.use("/public",express.static("public"))
app.use(cors())

app.use("/user/v1", userRouter);
app.use("/blog/v1", blogRouter);
app.use("/images/v1", imageRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})