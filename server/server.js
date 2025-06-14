import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser  from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
import skillRouter from "./routes/skillRouter.js";


const app = express();
const port = process.env.port || 4000;
connectDB();

const allowedOrigins =['http://localhost:5173']
axios.defaults.withCredentials = true;


app.use(express.json()) //all the request will be passd through json 
app.use(cookieParser());
app.use(cors({ origin:allowedOrigins,credentials:true})) //credentials true so that we can send cookies in the response from the express app


// API EndPoints
app.get("/",(req,res)=>{res.send("API Working");})
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/skill", skillRouter)
app.listen(port , (req,res)=>
{
    console.log(`Application is running on Port ${port}`);
})
