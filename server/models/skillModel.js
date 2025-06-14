import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  name: { type: String, required: true },
  proficiency: { type: String, required: true },
  hoursSpent: { type: Number, default: 0 },
});

const skillModel = mongoose.model("skill", skillSchema);

export default skillModel;
