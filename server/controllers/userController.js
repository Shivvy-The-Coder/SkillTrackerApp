import userModel from "../models/userModel.js";
import skillModel from "../models/skillModel.js";
import personalInfoModel from "../models/personalInfoModel.js"; // renamed import below for consistency

// Get basic user data
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
    return res.json({ success: false, message: err.message });
  }
};

// Get full dashboard information
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
    return res.json({ success: false, message: err.message });
  }
};

// Update personal info
export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.userId; // ✅ should come from auth middleware
    const { bio, goals } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!bio && !goals) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    let personalInfo = await personalInfoModel.findOne({ userId });

    if (!personalInfo) {
      // create new if doesn't exist
      personalInfo = new personalInfoModel({ userId, bio, goals });
    } else {
      // update existing
      if (bio !== undefined) personalInfo.bio = bio;
      if (goals !== undefined) personalInfo.goals = goals;
    }

    await personalInfo.save();

    res.json({ success: true, data: personalInfo });
  } catch (err) {
    console.error("Error in updatePersonalInfo:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
