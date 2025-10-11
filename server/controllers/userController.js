// import userModel from "../models/userModel.js";
// import skillModel from "../models/skillModel.js";
// import personalInfoModel from "../models/personalInfoModel.js"; // renamed import below for consistency

// // Get basic user data
// export const getUserData = async (req, res) => {
//   try {
//     const userId = req.userId; // ✅ extracted from JWT
//     console.log("userId in getUserData:", userId);

//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.json({ success: false, message: "User Not Found" });
//     }

//     const skills = await skillModel.find({ userId });
//     const personalInfo = await personalInfoModel.findOne({ userId });

//     return res.json({
//       success: true,
//       userData: {
//         name: user.name,
//         email: user.email,
//         isAccountVerified: user.isAccountVerified,
//         bio: personalInfo?.bio || '',
//         goals: personalInfo?.goals || '',
//         skills: skills || [],
//       },
//     });
//   } catch (err) {
//     return res.json({ success: false, message: err.message });
//   }
// };

// // Get full dashboard information
// export const getDashboardData = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const [user, personalInfo, skills] = await Promise.all([
//       userModel.findById(userId).select("name email"),
//       personalInfoModel.findOne({ userId }),
//       skillModel.find({ userId }),
//     ]);

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     return res.json({
//       success: true,
//       data: {
//         user,
//         personalInfo,
//         skills,
//       },
//     });
//   } catch (err) {
//     return res.json({ success: false, message: err.message });
//   }
// };

// export const updatePersonalInfo = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { bio, goals } = req.body;

//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const personalInfo = await personalInfoModel.findOneAndUpdate(
//       { userId },           // filter
//       { bio, goals },       // update
//       { new: true, upsert: true } // options: return updated doc, create if not exists
//     );

//     res.json({ success: true, data: personalInfo });
//   } catch (err) {
//     console.error("🔥 updatePersonalInfo error:", err);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


















import userModel from "../models/userModel.js";
import skillModel from "../models/skillModel.js";
import personalInfoModel from "../models/personalInfoModel.js";

// ===========================
// Get basic user data
// ===========================
export const getUserData = async (req, res) => {
  try {
    const userId = req.userId; // ✅ extracted from JWT
    console.log("userId in getUserData:", userId);

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    const skills = await skillModel.find({ userId });
    const personalInfo = await personalInfoModel.findOne({ userId });

    return res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        bio: personalInfo?.bio || '',
        goals: personalInfo?.goals || '',
        skills: skills || [],
      },
    });
  } catch (err) {
    console.error("🔥 getUserData error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// ===========================
// Get full dashboard data
// ===========================
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    const [user, personalInfo, skills] = await Promise.all([
      userModel.findById(userId).select("name email"),
      personalInfoModel.findOne({ userId }),
      skillModel.find({ userId }),
    ]);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      data: {
        user,
        personalInfo,
        skills,
      },
    });
  } catch (err) {
    console.error("🔥 getDashboardData error:", err);
    return res.json({ success: false, message: err.message });
  }
};


export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const { bio, goals } = req.body;

    // 1️⃣ Check for missing userId
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
    }

    // 2️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    console.log("➡️ Updating personal info for userId:", userId, { bio, goals });

    // 3️⃣ Update or create personal info safely
    const personalInfo = await personalInfoModel.findOneAndUpdate(
      { userId: userId },
      { bio: bio || "", goals: goals || "" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log("✅ Personal info updated:", personalInfo);

    return res.json({ success: true, data: personalInfo });
  } catch (err) {
    console.error("🔥 updatePersonalInfo error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};