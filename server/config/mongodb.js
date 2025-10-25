// import mongoose from "mongoose";

// const connectDB = async ()=>{
//     mongoose.connection.on('connected',()=>{
//         console.log("Database Connected")
//     })
//     await mongoose.connect(`${process.env.MONGODB_URI}/Personal_Tracker_App`);

// };

// export default connectDB;


import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
