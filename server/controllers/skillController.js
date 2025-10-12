import skillModel from "../models/skillModel.js";
export const addSkill = async (req, res) => {
  console.log("Add Skill Payload:", req.body);  // Log incoming data
  const { name, proficiency, hoursSpent } = req.body;

  try {
    const skill = await skillModel.create({
      userId: req.userId, // extracted via JWT middleware
      name,
      proficiency,
      hoursSpent: Number(hoursSpent) || 0,
    });

    return res.json({ success: true, data: skill });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const updateSkill = async (req, res) => {
  console.log("🔥 updateSkill called");
  console.log("req.userId:", req.userId);
  console.log("req.params.id:", req.params.id);
  console.log("req.body:", req.body);

  const skillId = req.params.id;
  const { name, proficiency, hoursSpent } = req.body;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (proficiency !== undefined) updateFields.proficiency = proficiency;
  if (hoursSpent !== undefined) updateFields.hoursSpent = Number(hoursSpent) || 0;

  try {
    const updatedSkill = await skillModel.findOneAndUpdate(
      { _id: skillId, userId: req.userId },
      updateFields,
      { new: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    return res.json({ success: true, data: updatedSkill });
  } catch (err) {
    console.error("🔥 updateSkill error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};







// Delete a skill
export const deleteSkill = async (req, res) => {
  const skillId = req.params.id;

  try {
    await skillModel.findOneAndDelete({ _id: skillId, userId: req.userId });
    return res.json({ success: true, message: "Skill deleted" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
