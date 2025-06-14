// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";
// import connectDB from "./config/mongodb.js";
// import authRouter from "./routes/authRoutes.js";
// import userRouter from "./routes/userRoutes.js";
// import skillRouter from "./routes/skillRouter.js";

// const app = express();
// const port = process.env.PORT || 4000;

// connectDB();

// const allowedOrigins = ['http://localhost:5173',
//     'https://skilltrackerapp-u627.onrender.com"'
// ];

// app.use(express.json());
// app.use(cookieParser());

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true
// }));

// // API EndPoints
// app.get("/", (req, res) => res.send("API Working"));

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/skill", skillRouter);

// app.listen(port, () => {
//   console.log(`Application is running on Port ${port}`);
// });

import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import skillRouter from "./routes/skillRouter.js";

const app = express();
const port = process.env.port || 4000;

// ✅ Connect DB
connectDB();

// ✅ Use cookie parser first
app.use(cookieParser());

// ✅ Enable JSON parsing
app.use(express.json());

// ✅ CORS - allow frontend from both dev and prod + cookies
const allowedOrigins = [
  "http://localhost:5173",
  "https://skilltrackerapp-u627.onrender.com",
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/skill", skillRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
