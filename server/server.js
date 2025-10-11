// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";
// import path from "path";
// import connectDB from "./config/mongodb.js";
// import authRouter from "./routes/authRoutes.js";
// import userRouter from "./routes/userRoutes.js";
// import skillRouter from "./routes/skillRouter.js";

// const app = express();
// const port = process.env.PORT || 4000;

// // ✅ Connect to MongoDB
// connectDB().catch((err) => console.error("DB Connection Error:", err));

// // Allowed frontend origins
// const allowedOrigins = [
//   "http://localhost:5173", // Vite dev server
//   "https://skilltrackerapp-1.onrender.com", // deployed frontend
// ];

// // ✅ Middleware
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (curl, mobile apps)
//       if (!origin) return callback(null, true);
//       if (!allowedOrigins.includes(origin)) {
//         const msg = `CORS blocked for origin: ${origin}`;
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // ✅ Routes
// app.get("/api/health", (req, res) => {
//   res.json({ success: true, message: "Server is running" });
// });

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/skill", skillRouter);

// // ✅ Serve frontend in production
// const __dirname = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   const clientPath = path.join(__dirname, "../client/dist"); // Vite build folder
//   app.use(express.static(clientPath));
// }

// // ✅ Start server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import skillRouter from "./routes/skillRouter.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to MongoDB
connectDB().catch((err) => console.error("DB Connection Error:", err));

// ✅ Allowed frontend origins (Add your real frontend + backend URLs)
const allowedOrigins = [
  "http://localhost:5173", // local Vite frontend
  "https://skilltrackerapp-1.onrender.com", // your deployed frontend
  "https://skilltrackerapp-visb.onrender.com", // your deployed backend (Render backend)
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        const msg = `CORS blocked for origin: ${origin}`;
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// ✅ Body & Cookie Parsers
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running fine 🚀" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/skill", skillRouter);

// ✅ Serve frontend in production
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientPath));

}

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
