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

// // ✅ Allowed frontend origins
// const allowedOrigins = [
//   "http://localhost:5173", // local frontend
//   "https://skilltrackerapp-1.onrender.com", // deployed frontend
//   "https://skilltrackerapp-visb.onrender.com", // deployed backend
// ];

// // ✅ CORS Middleware
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (e.g., curl, mobile)
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

// // ✅ Body & Cookie Parsers
// app.use(express.json());
// app.use(cookieParser());

// // ✅ API Routes
// app.get("/api/health", (req, res) => {
//   res.json({ success: true, message: "Server is running fine 🚀" });
// });

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/skill", skillRouter);

// // ✅ Serve frontend in production
// const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   const clientPath = path.join(__dirname, "../client/dist");
//   app.use(express.static(clientPath));

//   // ✅ Express 5–safe fallback route
//   app.use((req, res, next) => {
//     // skip API routes
//     if (req.originalUrl.startsWith("/api")) return next();
//     res.sendFile(path.join(clientPath, "index.html"));
//   });
// }



// // ✅ Start server
// app.listen(port, () => {
//   console.log(`✅ Server running on port ${port}`);
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

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "https://skilltrackerapp-1.onrender.com", // deployed frontend
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl, mobile apps
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ✅ Body & cookie parsers
app.use(express.json());
app.use(cookieParser());

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running 🚀" });
});

// ✅ API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/skill", skillRouter);

// ✅ Serve frontend in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/dist"); // Vite build folder
  app.use(express.static(clientPath));

  // Catch-all route for SPA (must be after API routes)
  // app.use((req, res, next) => {
  //   if (req.originalUrl.startsWith("/api")) return next(); // skip API
  //   res.sendFile(path.join(clientPath, "index.html"));
  // });

  app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  console.log(`Fallback triggered for: ${req.originalUrl}`);
  res.sendFile(path.join(clientPath, "index.html"));
});

}

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
