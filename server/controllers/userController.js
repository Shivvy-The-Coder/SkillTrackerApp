import userModel from "../models/userModel.js";
import skillModel from "../models/skillModel.js";
import personalInfoModel from "../models/personalInfoModel.js"; // renamed import below for consistency

// Get basic user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("userId in getUserData:", userId);

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    // Fetch skills for the user
    const skills = await skillModel.find({ userId });

    // (Optional) Fetch personal info
    const personalInfo = await personalInfoModel.findOne({ userId });

    return res.json({
      success: true,
      userData: {
        name: user.name,
        email:user.email,
        isAccountVerified: user.isAccountVerified,
        bio: personalInfo ? personalInfo.bio : '',
        goals: personalInfo ? personalInfo.goals : '',
        skills: skills || []
      },
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Get full dashboard information
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    const [user, personalInfo, skills] = await Promise.all([
      userModel.findById(userId).select("name email"),
      personalInfoModel.findOne({ userId }),  // make sure your schema uses 'userId'
      skillModel.find({ userId }),
    ]);

    if (!user) return res.json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      data: {
        user,
        personalInfo,   // fix capitalization: use the variable, not 'PersonalInfo'
        skills,
      },
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Update personal info
export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.userId; // Should be set by userAuth middleware
    const { bio, goals } = req.body;

    console.log("➡️ Incoming data:", { bio, goals });
    console.log("📌 User ID from auth middleware:", userId);

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found in request" });
    }

    let personalInfo = await personalInfoModel.findOne({ userId });

    if (!personalInfo) {
      // Create new personal info
      personalInfo = new personalInfoModel({
        userId,  // ✅ MAKE SURE THIS IS NOT undefined
        bio,
        goals,
      });
    } else {
      // Update existing info
      personalInfo.bio = bio;
      personalInfo.goals = goals;
    }

    await personalInfo.save();

    res.json({ success: true, data: personalInfo });
  } catch (error) {
    console.error("🔥 Error in updatePersonalInfo:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


