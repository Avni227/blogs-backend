import express from "express"
import "dotenv/config"
import connectDB from "./src/configs/db.config.js"
import cors from 'cors'
import userRouter from './src/routes/user.routes.js'
import blogRouter from './src/routes/blog.routes.js'

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

await connectDB()

app.use(express.json())
app.use(cors())

app.use("/user/v1", userRouter);

app.use("/blog/v1", blogRouter);

//app.use("/myblog/v1",  myBlogRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})