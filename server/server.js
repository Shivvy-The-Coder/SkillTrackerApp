import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import skillRouter from "./routes/skillRouter.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// ✅ Allow local frontend only
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("API Working Locally 🚀");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/skill", skillRouter);

app.listen(port, () => {
  console.log(`✅ Local server running on http://localhost:${port}`);
});
